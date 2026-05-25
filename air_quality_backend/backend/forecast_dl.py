import os
import sys

import numpy as np
import pandas as pd

try:
    import torch
except Exception:
    torch = None

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_ROOT_DIR = os.path.join(_BACKEND_DIR, "..")
_ML_DIR = os.path.join(_ROOT_DIR, "ml")
_ML_DL_DIR = os.path.join(_ROOT_DIR, "ml_dl")
_MODELS_DL_DIR = os.path.join(_ROOT_DIR, "models_dl")

sys.path.insert(0, _ML_DIR)
sys.path.insert(0, _ML_DL_DIR)

from data_loader import load_district_data  # noqa: E402

try:
    from model_lstm import LSTMRegressor  # noqa: E402
except Exception:
    LSTMRegressor = None


def _load_artifact(district_id: int):
    if torch is None:
        return None
    path = os.path.join(_MODELS_DL_DIR, f"district_{district_id}.pt")
    if not os.path.exists(path):
        return None
    return torch.load(path, map_location="cpu", weights_only=False)


def get_dl_runtime_status(district_id: int):
    if torch is None:
        return {"ok": False, "reason": "torch_missing"}
    if LSTMRegressor is None:
        return {"ok": False, "reason": "lstm_module_import_failed"}
    path = os.path.join(_MODELS_DL_DIR, f"district_{int(district_id)}.pt")
    if not os.path.exists(path):
        return {"ok": False, "reason": "model_file_missing", "path": path}
    return {"ok": True, "reason": "ready", "path": path}


def get_recent_history_dl(district_id: int, days: int = 60):
    try:
        df = load_district_data(int(district_id))
        recent = df.tail(days)
        return [
            {"date": r["date"].strftime("%Y-%m-%d"), "pm25_median": float(r["median"])}
            for _, r in recent.iterrows()
        ]
    except Exception:
        return []


def get_forecast_dl(district_id: int, days: int = 7):
    if torch is None or LSTMRegressor is None:
        return None

    artifact = _load_artifact(int(district_id))
    if artifact is None:
        return None

    df = load_district_data(int(district_id)).copy().sort_values("date").reset_index(drop=True)
    lookback = int(artifact["lookback"])
    feature_columns = artifact["feature_columns"]
    if len(df) <= lookback:
        return None

    scaler_x = artifact["scaler_x"]
    scaler_y = artifact["scaler_y"]
    residuals_std = float(artifact.get("residuals_std", 0.0))

    model = LSTMRegressor(input_size=int(artifact["input_size"]))
    model.load_state_dict(artifact["model_state_dict"])
    model.eval()

    last_date = df["date"].max()
    history_df = df.copy()
    results = []

    for i in range(days):
        window = history_df[feature_columns].tail(lookback).values.astype(np.float32)
        x_scaled = scaler_x.transform(window)
        x_tensor = torch.tensor(x_scaled, dtype=torch.float32).unsqueeze(0)
        with torch.no_grad():
            pred_scaled = model(x_tensor).cpu().numpy().reshape(-1, 1)
        pred = float(scaler_y.inverse_transform(pred_scaled).flatten()[0])
        pred = max(0.0, pred)

        next_date = last_date + pd.Timedelta(days=i + 1)
        results.append({
            "date": next_date.strftime("%Y-%m-%d"),
            "pm25_predicted": round(pred, 1),
            "pm25_lower": round(max(0.0, pred - 1.96 * residuals_std), 1),
            "pm25_upper": round(pred + 1.96 * residuals_std, 1),
        })

        next_row = history_df.iloc[-1].copy()
        next_row["date"] = next_date
        next_row["median"] = pred
        history_df = pd.concat([history_df, pd.DataFrame([next_row])], ignore_index=True)

    return results
