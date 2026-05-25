"""
Air Quality ML Training Script
================================
Trains multiple models per district and selects the best one by
recursive multi-step RMSE (7-day horizon), then saves to models/.
"""

import os
import sys
import copy
import pickle

import numpy as np
import pandas as pd

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

try:
    from xgboost import XGBRegressor
    _HAS_XGB = True
except ImportError:
    _HAS_XGB = False

try:
    from lightgbm import LGBMRegressor
    _HAS_LGB = True
except ImportError:
    _HAS_LGB = False

from data_loader import load_district_data, DISTRICT_FILES, DISTRICT_NAMES
from features import build_features, FEATURE_COLS
from evaluate import compute_metrics, cross_val_metrics

MODELS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models")
RECURSIVE_HORIZON = 7
MIN_ACCEPTABLE_TEST_R2 = 0.40
COMPOSITE_TEST_WEIGHT = 0.60
COMPOSITE_RECURSIVE_WEIGHT = 0.40
SMALL_DATA_THRESHOLD = 160
SMALL_DATA_ALLOWED_MODELS = {"Ridge", "GradientBoosting", "ExtraTrees"}


def _candidates():
    candidates = {
        "Ridge": Ridge(alpha=1.0),
        "RandomForest": RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1),
        "GradientBoosting": GradientBoostingRegressor(
            n_estimators=200, random_state=42, max_depth=4
        ),
        "ExtraTrees": ExtraTreesRegressor(n_estimators=200, random_state=42, n_jobs=-1),
    }
    if _HAS_XGB:
        candidates["XGBoost"] = XGBRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            verbosity=0,
            n_jobs=-1,
        )
    if _HAS_LGB:
        candidates["LightGBM"] = LGBMRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            verbose=-1,
            n_jobs=-1,
        )
    return candidates


def _future_feature_vector(next_date, history: list, last_stats: dict) -> list:
    doy = int(next_date.dayofyear)
    dow = int(next_date.dayofweek)
    n = len(history)

    def lag(k):
        return float(history[-k]) if n >= k else float(history[0])

    def roll_mean(w):
        vals = history[-w:] if n >= w else history
        return float(np.mean(vals))

    def roll_std(w):
        vals = history[-w:] if n >= w else history
        return float(np.std(vals, ddof=1)) if len(vals) >= 2 else 0.0

    return [
        doy,
        dow,
        int(next_date.month),
        int((next_date.month - 1) // 3 + 1),
        np.sin(2 * np.pi * doy / 365),
        np.cos(2 * np.pi * doy / 365),
        np.sin(4 * np.pi * doy / 365),
        np.cos(4 * np.pi * doy / 365),
        np.sin(2 * np.pi * dow / 7),
        np.cos(2 * np.pi * dow / 7),
        lag(1),
        lag(2),
        lag(3),
        lag(4),
        lag(5),
        lag(6),
        lag(7),
        lag(14),
        lag(30),
        lag(60),
        lag(90),
        roll_mean(7),
        roll_mean(14),
        roll_mean(30),
        roll_std(7),
        roll_std(14),
        roll_std(30),
        last_stats["min"],
        last_stats["max"],
        last_stats["q1"],
        last_stats["q3"],
        last_stats["stdev"],
    ]


def _recursive_backtest_metrics(model, raw_df: pd.DataFrame, split_idx: int, horizon: int) -> dict:
    if split_idx < 100 or len(raw_df) - split_idx <= horizon:
        return {"MAE": float("nan"), "RMSE": float("nan"), "R2": float("nan")}

    y_true_all = []
    y_pred_all = []
    max_origin = len(raw_df) - horizon

    for origin in range(split_idx, max_origin):
        hist_df = raw_df.iloc[:origin].copy()
        if len(hist_df) < 100:
            continue

        history = list(hist_df["median"].values.astype(float))
        last_date = hist_df["date"].max()
        last_stats = {
            col: float(hist_df[col].tail(7).mean()) if col in hist_df.columns else 0.0
            for col in ["min", "max", "q1", "q3", "stdev"]
        }

        preds = []
        for step in range(horizon):
            next_date = last_date + pd.Timedelta(days=step + 1)
            feat_vec = _future_feature_vector(next_date, history, last_stats)
            pred = float(model.predict(np.array([feat_vec]))[0])
            pred = max(0.0, pred)
            preds.append(pred)
            history.append(pred)

        future_true = raw_df.iloc[origin:origin + horizon]["median"].values.astype(float)
        y_true_all.extend(future_true.tolist())
        y_pred_all.extend(preds)

    if not y_true_all:
        return {"MAE": float("nan"), "RMSE": float("nan"), "R2": float("nan")}

    return compute_metrics(np.array(y_true_all), np.array(y_pred_all))


def _safe_score(value: float, fallback: float = 1e9) -> float:
    if value is None:
        return fallback
    try:
        v = float(value)
    except Exception:
        return fallback
    return fallback if np.isnan(v) else v


def _naive_baseline_metrics(y_train: np.ndarray, y_test: np.ndarray) -> dict:
    if len(y_test) == 0:
        return {"MAE": float("nan"), "RMSE": float("nan"), "R2": float("nan")}

    last_value_preds = np.full_like(y_test, fill_value=float(y_train[-1]), dtype=float)
    seasonal_preds = []
    buffer = list(y_train.astype(float))
    for i in range(len(y_test)):
        pred = buffer[-7] if len(buffer) >= 7 else buffer[-1]
        seasonal_preds.append(float(pred))
        buffer.append(float(y_test[i]))

    m_last = compute_metrics(y_test, last_value_preds)
    m_seasonal = compute_metrics(y_test, np.array(seasonal_preds, dtype=float))
    if _safe_score(m_seasonal["RMSE"]) <= _safe_score(m_last["RMSE"]):
        return {"name": "naive_seasonal_lag7", **m_seasonal}
    return {"name": "naive_last_value", **m_last}


def _composite_score(test_rmse: float, recursive_rmse: float) -> float:
    return COMPOSITE_TEST_WEIGHT * _safe_score(test_rmse) + COMPOSITE_RECURSIVE_WEIGHT * _safe_score(recursive_rmse)


def _select_best_model(results: dict, n_train: int) -> tuple[str, str, float]:
    candidates = results.copy()
    if n_train < SMALL_DATA_THRESHOLD:
        candidates = {k: v for k, v in candidates.items() if k in SMALL_DATA_ALLOWED_MODELS}
        if not candidates:
            candidates = results

    gated = {
        name: metrics for name, metrics in candidates.items()
        if _safe_score(metrics["test"].get("R2"), fallback=-1e9) >= MIN_ACCEPTABLE_TEST_R2
    }
    pool = gated if gated else candidates
    reason = "composite(test_rmse,recursive_rmse)+r2_gate"
    if not gated:
        reason = "composite(test_rmse,recursive_rmse)_fallback_no_r2_pass"

    best_name = min(
        pool,
        key=lambda k: _composite_score(pool[k]["test"]["RMSE"], pool[k]["recursive"]["RMSE"])
    )
    best_score = _composite_score(pool[best_name]["test"]["RMSE"], pool[best_name]["recursive"]["RMSE"])
    return best_name, reason, best_score


def train_district(district_id: int) -> dict:
    name = DISTRICT_NAMES.get(district_id, str(district_id))
    print(f"\n{'=' * 68}")
    print(f"  District {district_id}: {name}")
    print(f"{'=' * 68}")

    raw_df = load_district_data(district_id)
    feat_df = build_features(raw_df.copy())

    X = feat_df[FEATURE_COLS].values
    y = feat_df["median"].values

    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    baseline_m = _naive_baseline_metrics(y_train, y_test)

    print(f"  Samples -> train: {len(X_train)}, test: {len(X_test)}")
    print(
        f"\n  {'Model':<22} {'CV MAE':>8} {'CV RMSE':>9} {'CV R2':>7} "
        f"{'Test MAE':>9} {'Test RMSE':>10} {'Test R2':>8} {'Rec RMSE':>9}"
    )
    print(f"  {'-' * 22} {'-' * 8} {'-' * 9} {'-' * 7} {'-' * 9} {'-' * 10} {'-' * 8} {'-' * 9}")

    results = {}
    for model_name, model in _candidates().items():
        pipe = Pipeline([("scaler", StandardScaler()), ("model", model)])

        cv_pipe = Pipeline([("scaler", StandardScaler()), ("model", copy.deepcopy(model))])
        cv_m = cross_val_metrics(cv_pipe, X_train, y_train, n_splits=5)

        pipe.fit(X_train, y_train)
        test_m = compute_metrics(y_test, pipe.predict(X_test))
        rec_m = _recursive_backtest_metrics(pipe, raw_df, split_idx=split, horizon=RECURSIVE_HORIZON)

        results[model_name] = {"cv": cv_m, "test": test_m, "recursive": rec_m}

        print(
            f"  {model_name:<22} {cv_m['MAE']:>8.2f} {cv_m['RMSE']:>9.2f} {cv_m['R2']:>7.3f} "
            f"{test_m['MAE']:>9.2f} {test_m['RMSE']:>10.2f} {test_m['R2']:>8.3f} {rec_m['RMSE']:>9.2f}"
        )

    print(
        f"\n  Baseline ({baseline_m['name']}): "
        f"Test MAE={baseline_m['MAE']:.2f}, Test RMSE={baseline_m['RMSE']:.2f}, Test R2={baseline_m['R2']:.3f}"
    )

    best_name, selection_reason, selection_score = _select_best_model(results, n_train=len(X_train))
    best_metrics = results[best_name]
    uplift_vs_baseline_rmse = _safe_score(baseline_m["RMSE"]) - _safe_score(best_metrics["test"]["RMSE"], fallback=0.0)
    print(
        f"\n  >>> Best model: {best_name} "
        f"(Rec RMSE={best_metrics['recursive']['RMSE']}, Test RMSE={best_metrics['test']['RMSE']}, "
        f"Composite={selection_score:.3f}, Uplift vs baseline RMSE={uplift_vs_baseline_rmse:.3f})"
    )

    final_pipe = Pipeline([("scaler", StandardScaler()), ("model", copy.deepcopy(_candidates()[best_name]))])
    final_pipe.fit(X, y)
    residuals_std = float(np.std(y_test - Pipeline([("scaler", StandardScaler()), ("model", copy.deepcopy(_candidates()[best_name]))]).fit(X_train, y_train).predict(X_test)))

    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, f"district_{district_id}.pkl")
    payload = {
        "model": final_pipe,
        "best_name": best_name,
        "feature_cols": FEATURE_COLS,
        "residuals_std": residuals_std,
        "test_metrics": best_metrics["test"],
        "recursive_metrics": best_metrics["recursive"],
        "all_results": results,
        "selection_metric": f"{selection_reason}; composite={COMPOSITE_TEST_WEIGHT}*test_rmse+{COMPOSITE_RECURSIVE_WEIGHT}*recursive_rmse",
        "baseline_metrics": baseline_m,
        "uplift_vs_baseline_rmse": round(float(uplift_vs_baseline_rmse), 3),
        "district_id": district_id,
        "district_name": name,
        "n_samples": len(X),
    }
    with open(model_path, "wb") as f:
        pickle.dump(payload, f)
    print(f"  Saved -> {model_path}")
    return payload


def train_all():
    print("\n" + "=" * 68)
    print("  AIR QUALITY ML TRAINING - Almaty PM2.5 Forecasting")
    print("=" * 68)

    summary = {}
    for did in DISTRICT_FILES:
        payload = train_district(did)
        summary[did] = {
            "district": payload["district_name"],
            "best_model": payload["best_name"],
            "mae": payload["test_metrics"]["MAE"],
            "rmse": payload["test_metrics"]["RMSE"],
            "r2": payload["test_metrics"]["R2"],
            "rec_rmse": payload["recursive_metrics"]["RMSE"],
        }

    print(f"\n{'=' * 68}")
    print("  FINAL SUMMARY")
    print(f"{'=' * 68}")
    print(
        f"  {'District':<14} {'Best Model':<22} {'Test MAE':>9} {'Test RMSE':>10} "
        f"{'Test R2':>8} {'Rec RMSE':>9}"
    )
    print(f"  {'-' * 14} {'-' * 22} {'-' * 9} {'-' * 10} {'-' * 8} {'-' * 9}")
    for _, s in summary.items():
        print(
            f"  {s['district']:<14} {s['best_model']:<22} {s['mae']:>9.2f} "
            f"{s['rmse']:>10.2f} {s['r2']:>8.3f} {s['rec_rmse']:>9.2f}"
        )
    print("=" * 68)
    print("\nAll models saved to: models/")
    print("Start the API: python backend/app.py\n")


if __name__ == "__main__":
    train_all()
