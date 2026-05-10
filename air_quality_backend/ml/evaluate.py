import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import TimeSeriesSplit


def compute_metrics(y_true, y_pred) -> dict:
    mae  = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2   = r2_score(y_true, y_pred)
    return {'MAE': round(mae, 3), 'RMSE': round(rmse, 3), 'R2': round(r2, 3)}


def cross_val_metrics(pipeline, X, y, n_splits: int = 5) -> dict:
    """Time-series cross-validation — never peeks at the future."""
    import copy
    tscv = TimeSeriesSplit(n_splits=n_splits)
    maes, rmses, r2s = [], [], []
    for train_idx, test_idx in tscv.split(X):
        pipe = copy.deepcopy(pipeline)
        pipe.fit(X[train_idx], y[train_idx])
        preds = pipe.predict(X[test_idx])
        m = compute_metrics(y[test_idx], preds)
        maes.append(m['MAE'])
        rmses.append(m['RMSE'])
        r2s.append(m['R2'])
    return {
        'MAE':  round(float(np.mean(maes)),  3),
        'RMSE': round(float(np.mean(rmses)), 3),
        'R2':   round(float(np.mean(r2s)),   3),
    }
