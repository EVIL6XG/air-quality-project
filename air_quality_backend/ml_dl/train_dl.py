import os
import copy
import json

import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

from dataset import make_sequences
from model_lstm import LSTMRegressor


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "models_dl")
DISTRICTS = [1, 2, 3, 4, 5]


def _metrics(y_true, y_pred):
    mae = float(np.mean(np.abs(y_true - y_pred)))
    rmse = float(np.sqrt(np.mean((y_true - y_pred) ** 2)))
    mape = float(np.mean(np.abs((y_true - y_pred) / np.maximum(np.abs(y_true), 1e-6))) * 100.0)
    return {"MAE": round(mae, 3), "RMSE": round(rmse, 3), "MAPE": round(mape, 3)}


def train_one_district(district_id: int, lookback: int = 30, epochs: int = 80, batch_size: int = 32):
    pkg = make_sequences(district_id, lookback=lookback)
    x, y = pkg["x"], pkg["y"]
    if len(x) < 120:
        raise ValueError(f"Not enough sequence samples for district {district_id}")

    split = int(len(x) * 0.8)
    x_train, x_val = x[:split], x[split:]
    y_train, y_val = y[:split], y[split:]

    train_ds = TensorDataset(torch.tensor(x_train), torch.tensor(y_train))
    val_ds = TensorDataset(torch.tensor(x_val), torch.tensor(y_val))
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=False)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = LSTMRegressor(input_size=x.shape[-1]).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.MSELoss()

    best_state = None
    best_val_loss = float("inf")
    patience = 10
    patience_left = patience

    for _ in range(epochs):
        model.train()
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            optimizer.zero_grad()
            pred = model(xb)
            loss = criterion(pred, yb)
            loss.backward()
            optimizer.step()

        model.eval()
        val_losses = []
        with torch.no_grad():
            for xb, yb in val_loader:
                xb, yb = xb.to(device), yb.to(device)
                pred = model(xb)
                val_losses.append(float(criterion(pred, yb).item()))
        mean_val_loss = float(np.mean(val_losses)) if val_losses else float("inf")

        if mean_val_loss < best_val_loss:
            best_val_loss = mean_val_loss
            best_state = copy.deepcopy(model.state_dict())
            patience_left = patience
        else:
            patience_left -= 1
            if patience_left <= 0:
                break

    if best_state is not None:
        model.load_state_dict(best_state)

    model.eval()
    with torch.no_grad():
        y_pred_scaled = model(torch.tensor(x_val).to(device)).cpu().numpy()

    scaler_y = pkg["scaler_y"]
    y_val_real = scaler_y.inverse_transform(y_val.reshape(-1, 1)).flatten()
    y_pred_real = scaler_y.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()
    metrics = _metrics(y_val_real, y_pred_real)
    residuals_std = float(np.std(y_val_real - y_pred_real))

    payload = {
        "district_id": district_id,
        "lookback": lookback,
        "input_size": x.shape[-1],
        "feature_columns": pkg["feature_columns"],
        "model_state_dict": model.state_dict(),
        "scaler_x": pkg["scaler_x"],
        "scaler_y": pkg["scaler_y"],
        "residuals_std": residuals_std,
        "metrics": metrics,
    }
    return payload


def train_all():
    os.makedirs(MODELS_DIR, exist_ok=True)
    summary = {}
    for did in DISTRICTS:
        payload = train_one_district(did)
        model_path = os.path.join(MODELS_DIR, f"district_{did}.pt")
        torch.save(payload, model_path)
        summary[did] = payload["metrics"]
        print(f"Saved {model_path} | {payload['metrics']}")

    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    train_all()
