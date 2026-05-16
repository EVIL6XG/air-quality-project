import numpy as np
import pandas as pd

FEATURE_COLS = [
    # Calendar
    'day_of_year', 'day_of_week', 'month', 'quarter',
    # Fourier – yearly seasonality
    'sin_365', 'cos_365', 'sin2_365', 'cos2_365',
    # Fourier – weekly seasonality
    'sin_7', 'cos_7',
    # Lag features (dense short-term + medium/long-term memory)
    'lag_1', 'lag_2', 'lag_3', 'lag_4', 'lag_5', 'lag_6',
    'lag_7', 'lag_14', 'lag_30', 'lag_60', 'lag_90',
    # Rolling statistics (computed on shifted series to avoid leakage)
    'rolling_mean_7', 'rolling_mean_14', 'rolling_mean_30',
    'rolling_std_7',  'rolling_std_14',  'rolling_std_30',
    # PM2.5 distribution features from sensor
    'min', 'max', 'q1', 'q3', 'stdev',
]


def _add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df['day_of_year'] = df['date'].dt.dayofyear
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month']       = df['date'].dt.month
    df['quarter']     = df['date'].dt.quarter
    doy = df['day_of_year']
    dow = df['day_of_week']
    df['sin_365']  = np.sin(2 * np.pi * doy / 365)
    df['cos_365']  = np.cos(2 * np.pi * doy / 365)
    df['sin2_365'] = np.sin(4 * np.pi * doy / 365)
    df['cos2_365'] = np.cos(4 * np.pi * doy / 365)
    df['sin_7']    = np.sin(2 * np.pi * dow / 7)
    df['cos_7']    = np.cos(2 * np.pi * dow / 7)
    return df


def _add_lag_features(df: pd.DataFrame, col: str = 'median') -> pd.DataFrame:
    df = df.copy()
    for lag in [1, 2, 3, 4, 5, 6, 7, 14, 30, 60, 90]:
        df[f'lag_{lag}'] = df[col].shift(lag)
    return df


def _add_rolling_features(df: pd.DataFrame, col: str = 'median') -> pd.DataFrame:
    df = df.copy()
    shifted = df[col].shift(1)  # shift(1) prevents data leakage
    for window in [7, 14, 30]:
        df[f'rolling_mean_{window}'] = shifted.rolling(window).mean()
        df[f'rolling_std_{window}']  = shifted.rolling(window).std()
    return df


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = _add_time_features(df)
    df = _add_lag_features(df)
    df = _add_rolling_features(df)
    df = df.dropna(subset=FEATURE_COLS).reset_index(drop=True)
    return df

