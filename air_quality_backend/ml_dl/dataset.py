import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

import os
import sys

_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_ML_DIR = os.path.join(_BASE_DIR, "..", "ml")
sys.path.insert(0, _ML_DIR)

from data_loader import load_district_data


FEATURE_COLUMNS = ["median", "min", "max", "q1", "q3", "stdev"]


def _prepare_df(district_id: int) -> pd.DataFrame:
    df = load_district_data(district_id).copy()
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0.0
    df = df.sort_values("date").reset_index(drop=True)
    return df


def make_sequences(district_id: int, lookback: int = 30):
    df = _prepare_df(district_id)
    values = df[FEATURE_COLUMNS].values.astype(np.float32)

    scaler_x = StandardScaler()
    scaler_y = StandardScaler()
    x_scaled = scaler_x.fit_transform(values)
    y_scaled = scaler_y.fit_transform(df[["median"]].values.astype(np.float32)).flatten()

    x_seq, y_seq = [], []
    for i in range(lookback, len(df)):
        x_seq.append(x_scaled[i - lookback:i, :])
        y_seq.append(y_scaled[i])

    x_seq = np.array(x_seq, dtype=np.float32)
    y_seq = np.array(y_seq, dtype=np.float32)

    return {
        "df": df,
        "x": x_seq,
        "y": y_seq,
        "scaler_x": scaler_x,
        "scaler_y": scaler_y,
        "feature_columns": FEATURE_COLUMNS,
    }
