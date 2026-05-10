import os
import sys
import pickle

import numpy as np
import pandas as pd

# ── Resolve paths ─────────────────────────────────────────────────────────────
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_ML_DIR      = os.path.join(_BACKEND_DIR, '..', 'ml')
_MODELS_DIR  = os.path.join(_BACKEND_DIR, '..', 'models')

sys.path.insert(0, _ML_DIR)

from data_loader import load_district_data   # noqa: E402
from features import FEATURE_COLS            # noqa: E402


# ── Model loader ──────────────────────────────────────────────────────────────

def _load_model(district_id: int):
    path = os.path.join(_MODELS_DIR, f'district_{district_id}.pkl')
    if not os.path.exists(path):
        return None
    with open(path, 'rb') as f:
        return pickle.load(f)


# ── Feature vector for a single future date ───────────────────────────────────

def _future_feature_vector(next_date, history: list, last_stats: dict) -> list:
    """
    Build one feature row for `next_date` using the rolling `history` buffer
    (real historical values + previously predicted values).
    Order must match FEATURE_COLS exactly.
    """
    doy = int(next_date.dayofyear)
    dow = int(next_date.dayofweek)
    n   = len(history)

    def lag(k):
        return float(history[-k]) if n >= k else float(history[0])

    def roll_mean(w):
        vals = history[-w:] if n >= w else history
        return float(np.mean(vals))

    def roll_std(w):
        vals = history[-w:] if n >= w else history
        return float(np.std(vals, ddof=1)) if len(vals) >= 2 else 0.0

    return [
        # Calendar
        doy, dow, int(next_date.month), int((next_date.month - 1) // 3 + 1),
        # Fourier – yearly
        np.sin(2 * np.pi * doy / 365), np.cos(2 * np.pi * doy / 365),
        np.sin(4 * np.pi * doy / 365), np.cos(4 * np.pi * doy / 365),
        # Fourier – weekly
        np.sin(2 * np.pi * dow / 7),   np.cos(2 * np.pi * dow / 7),
        # Lags (dense short-term + medium/long-term)
        lag(1), lag(2), lag(3), lag(4), lag(5), lag(6),
        lag(7), lag(14), lag(30), lag(60), lag(90),
        # Rolling means
        roll_mean(7), roll_mean(14), roll_mean(30),
        # Rolling stds
        roll_std(7),  roll_std(14),  roll_std(30),
        # Sensor distribution stats (recent average as proxy)
        last_stats['min'], last_stats['max'],
        last_stats['q1'],  last_stats['q3'], last_stats['stdev'],
    ]


# ── Public API ────────────────────────────────────────────────────────────────

def get_forecast(district_id, days: int = 7):
    district_id = int(district_id)
    model_data  = _load_model(district_id)

    if model_data is None:
        # No trained model yet → fall back to simple Ridge on DB data
        return _ridge_db_fallback(district_id, days)

    try:
        df = load_district_data(district_id)
    except Exception:
        return _ridge_db_fallback(district_id, days)

    if len(df) < 30:
        return None

    model         = model_data['model']
    residuals_std = model_data['residuals_std']

    # Rolling history buffer starts with all real observations
    history   = list(df['median'].values.astype(float))
    last_date = df['date'].max()

    # Use 7-day average of sensor stats so single-day spikes don't distort CIs
    last_stats = {
        col: float(df[col].tail(7).mean()) if col in df.columns else 0.0
        for col in ['min', 'max', 'q1', 'q3', 'stdev']
    }

    results = []
    for i in range(days):
        next_date = last_date + pd.Timedelta(days=i + 1)
        feat_vec  = _future_feature_vector(next_date, history, last_stats)
        pred      = float(model.predict(np.array([feat_vec]))[0])
        pred      = max(0.0, pred)
        history.append(pred)  # feed prediction back for next iteration

        results.append({
            'date':           next_date.strftime('%Y-%m-%d'),
            'pm25_predicted': round(pred, 1),
            'pm25_lower':     round(max(0.0, pred - 1.96 * residuals_std), 1),
            'pm25_upper':     round(pred + 1.96 * residuals_std, 1),
        })

    return results


def get_recent_history(district_id, days: int = 60):
    district_id = int(district_id)
    try:
        df     = load_district_data(district_id)
        recent = df.tail(days)
        return [
            {
                'date':        r['date'].strftime('%Y-%m-%d'),
                'pm25_median': float(r['median']) if pd.notna(r['median']) else None,
            }
            for _, r in recent.iterrows()
        ]
    except Exception:
        return _db_get_recent_history(district_id, days)


# ── Fallback: Ridge on PostgreSQL data ───────────────────────────────────────
# Used only before first `python ml/train.py` run.

def _ridge_db_fallback(district_id: int, days: int):
    try:
        from db import get_connection
        conn   = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT date, pm25_median FROM pm25_daily "
            "WHERE district_id = %s ORDER BY date",
            [district_id],
        )
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
    except Exception:
        return None

    if len(rows) < 30:
        return None

    from sklearn.linear_model import Ridge

    df = pd.DataFrame(rows, columns=['ds', 'y'])
    df['ds'] = pd.to_datetime(df['ds'])
    df['y']  = df['y'].astype(float)
    df = df.dropna(subset=['y'])
    n  = len(df)

    def _make_feats(dates, start_n=0):
        dates = pd.Series(pd.to_datetime(dates))
        t   = np.arange(start_n, start_n + len(dates))
        doy = dates.dt.dayofyear.values
        dow = dates.dt.dayofweek.values
        return np.column_stack([
            t,
            np.sin(2 * np.pi * doy / 365), np.cos(2 * np.pi * doy / 365),
            np.sin(4 * np.pi * doy / 365), np.cos(4 * np.pi * doy / 365),
            np.sin(2 * np.pi * dow / 7),   np.cos(2 * np.pi * dow / 7),
        ])

    X = _make_feats(df['ds'])
    y = df['y'].values
    m = Ridge(alpha=1.0)
    m.fit(X, y)
    residuals_std = float(np.std(y - m.predict(X)))
    last_date     = df['ds'].max()
    future_dates  = pd.date_range(last_date + pd.Timedelta(days=1), periods=days)
    preds         = m.predict(_make_feats(future_dates, start_n=n))

    return [
        {
            'date':           future_dates[i].strftime('%Y-%m-%d'),
            'pm25_predicted': round(max(0.0, float(preds[i])), 1),
            'pm25_lower':     round(max(0.0, float(preds[i]) - 1.96 * residuals_std), 1),
            'pm25_upper':     round(max(0.0, float(preds[i]) + 1.96 * residuals_std), 1),
        }
        for i in range(days)
    ]


def _db_get_recent_history(district_id: int, days: int):
    try:
        from db import get_connection
        conn   = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT date, pm25_median FROM pm25_daily "
            "WHERE district_id = %s ORDER BY date DESC LIMIT %s",
            [district_id, days],
        )
        rows = list(reversed(cursor.fetchall()))
        cursor.close()
        conn.close()
        return [
            {'date': str(r[0]), 'pm25_median': float(r[1]) if r[1] is not None else None}
            for r in rows
        ]
    except Exception:
        return []
