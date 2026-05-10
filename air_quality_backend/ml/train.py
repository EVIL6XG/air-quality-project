"""
Air Quality ML Training Script
================================
Trains up to 6 models per district (Ridge, RandomForest, ExtraTrees,
GradientBoosting, XGBoost, LightGBM), evaluates with TimeSeriesSplit CV,
selects the best by test-set RMSE, and saves it to models/.

Usage:
    cd air_quality_backend/ml
    python train.py
"""

import os
import sys
import copy
import pickle

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sklearn.linear_model import Ridge
from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
    ExtraTreesRegressor,
)
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

MODELS_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 'models'
)

# ── Candidate models ─────────────────────────────────────────────────────────

def _candidates():
    candidates = {
        'Ridge': Ridge(alpha=1.0),
        'RandomForest': RandomForestRegressor(
            n_estimators=200, random_state=42, n_jobs=-1
        ),
        'GradientBoosting': GradientBoostingRegressor(
            n_estimators=200, random_state=42, max_depth=4
        ),
        'ExtraTrees': ExtraTreesRegressor(
            n_estimators=200, random_state=42, n_jobs=-1
        ),
    }
    if _HAS_XGB:
        candidates['XGBoost'] = XGBRegressor(
            n_estimators=300, learning_rate=0.05, max_depth=5,
            subsample=0.8, colsample_bytree=0.8,
            random_state=42, verbosity=0, n_jobs=-1,
        )
    if _HAS_LGB:
        candidates['LightGBM'] = LGBMRegressor(
            n_estimators=300, learning_rate=0.05, max_depth=5,
            subsample=0.8, colsample_bytree=0.8,
            random_state=42, verbose=-1, n_jobs=-1,
        )
    return candidates


# ── Per-district training ─────────────────────────────────────────────────────

def train_district(district_id: int) -> dict:
    name = DISTRICT_NAMES.get(district_id, str(district_id))
    print(f"\n{'='*68}")
    print(f"  District {district_id}: {name}")
    print(f"{'='*68}")

    df = load_district_data(district_id)
    df = build_features(df)

    X = df[FEATURE_COLS].values
    y = df['median'].values

    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    print(f"  Samples → train: {len(X_train)}, test: {len(X_test)}")
    print(
        f"\n  {'Model':<22} "
        f"{'CV MAE':>8} {'CV RMSE':>9} {'CV R²':>7} "
        f"{'Test MAE':>9} {'Test RMSE':>10} {'Test R²':>8}"
    )
    print(f"  {'-'*22} {'-'*8} {'-'*9} {'-'*7} {'-'*9} {'-'*10} {'-'*8}")

    results = {}
    trained_pipelines = {}

    for model_name, model in _candidates().items():
        pipe = Pipeline([('scaler', StandardScaler()), ('model', model)])

        # 5-fold time-series cross-validation on training split
        cv_pipe = Pipeline([
            ('scaler', StandardScaler()),
            ('model', copy.deepcopy(model)),
        ])
        cv_m = cross_val_metrics(cv_pipe, X_train, y_train, n_splits=5)

        # Final fit on full train split, evaluate on held-out test
        pipe.fit(X_train, y_train)
        test_m = compute_metrics(y_test, pipe.predict(X_test))

        results[model_name] = {'cv': cv_m, 'test': test_m}
        trained_pipelines[model_name] = pipe

        print(
            f"  {model_name:<22} "
            f"{cv_m['MAE']:>8.2f} {cv_m['RMSE']:>9.2f} {cv_m['R2']:>7.3f} "
            f"{test_m['MAE']:>9.2f} {test_m['RMSE']:>10.2f} {test_m['R2']:>8.3f}"
        )

    # ── Select best by test RMSE ──────────────────────────────────────────────
    best_name = min(results, key=lambda k: results[k]['test']['RMSE'])
    best_metrics = results[best_name]
    print(
        f"\n  >>> Best model: {best_name}  "
        f"(Test RMSE={best_metrics['test']['RMSE']}, "
        f"Test R²={best_metrics['test']['R2']})"
    )

    # ── Retrain best on ALL data (train+test) ─────────────────────────────────
    final_pipe = Pipeline([
        ('scaler', StandardScaler()),
        ('model', copy.deepcopy(_candidates()[best_name])),
    ])
    final_pipe.fit(X, y)
    residuals_std = float(np.std(y - final_pipe.predict(X)))

    # ── Save ──────────────────────────────────────────────────────────────────
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, f'district_{district_id}.pkl')
    payload = {
        'model':         final_pipe,
        'best_name':     best_name,
        'feature_cols':  FEATURE_COLS,
        'residuals_std': residuals_std,
        'test_metrics':  best_metrics['test'],
        'all_results':   results,
        'district_id':   district_id,
        'district_name': name,
        'n_samples':     len(X),
    }
    with open(model_path, 'wb') as f:
        pickle.dump(payload, f)
    print(f"  Saved → {model_path}")
    return payload


# ── Train all districts ───────────────────────────────────────────────────────

def train_all():
    print("\n" + "="*68)
    print("  AIR QUALITY ML TRAINING  —  Almaty PM2.5 Forecasting")
    print("="*68)

    summary = {}
    for did in DISTRICT_FILES:
        payload = train_district(did)
        summary[did] = {
            'district':   payload['district_name'],
            'best_model': payload['best_name'],
            'mae':        payload['test_metrics']['MAE'],
            'rmse':       payload['test_metrics']['RMSE'],
            'r2':         payload['test_metrics']['R2'],
        }

    print(f"\n{'='*68}")
    print("  FINAL SUMMARY")
    print(f"{'='*68}")
    print(
        f"  {'District':<14} {'Best Model':<22} "
        f"{'Test MAE':>9} {'Test RMSE':>10} {'Test R²':>8}"
    )
    print(f"  {'-'*14} {'-'*22} {'-'*9} {'-'*10} {'-'*8}")
    for did, s in summary.items():
        print(
            f"  {s['district']:<14} {s['best_model']:<22} "
            f"{s['mae']:>9.2f} {s['rmse']:>10.2f} {s['r2']:>8.3f}"
        )
    print("="*68)
    print("\nAll models saved to: models/")
    print("Start the API:  python backend/app.py\n")


if __name__ == '__main__':
    train_all()
