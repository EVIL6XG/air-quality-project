import os
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')

DISTRICT_FILES = {
    1: 'pm25_bostandyk.csv',
    2: 'pm25_medeu.csv',
    3: 'pm25_auezov.csv',
    4: 'pm25_alatau.csv',
    5: 'pm25_jetisu.csv',
}

DISTRICT_NAMES = {
    1: 'Bostandyk',
    2: 'Medeu',
    3: 'Auezov',
    4: 'Alatau',
    5: 'Jetisu',
}


def load_district_data(district_id: int) -> pd.DataFrame:
    filename = DISTRICT_FILES.get(int(district_id))
    if not filename:
        raise ValueError(f"Unknown district_id: {district_id}")
    filepath = os.path.join(DATA_DIR, filename)
    df = pd.read_csv(filepath, parse_dates=['date'])
    df = df.sort_values('date').reset_index(drop=True)
    df = df.dropna(subset=['median'])
    df['median'] = df['median'].astype(float)
    for col in ['min', 'max', 'q1', 'q3', 'stdev']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)
    return df


def load_all_districts() -> dict:
    return {did: load_district_data(did) for did in DISTRICT_FILES}
