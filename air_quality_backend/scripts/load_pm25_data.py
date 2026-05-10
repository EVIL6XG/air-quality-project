import pandas as pd
import pg8000
import os

conn = pg8000.connect(
    database="airq_almaty",
    user="postgres",
    password="postgre",
    host="localhost",
    port=5432
)
cursor = conn.cursor()

district_map = {
    "pm25_bostandyk.csv": 1,
    "pm25_medeu.csv": 2,
    "pm25_auezov.csv": 3,
    "pm25_alatau.csv": 4,
    "pm25_jetisu.csv": 5
}

data_folder = "data"


#данные
for filename, district_id in district_map.items():
    path = os.path.join(data_folder, filename)
    print(f"Loading {filename}")

    df = pd.read_csv(path)

    for _, row in df.iterrows():
        cursor.execute(
            """
            INSERT INTO pm25_daily 
            (district_id, date, pm25_min, pm25_max, pm25_median, pm25_q1, pm25_q3, pm25_stdev, pm25_count)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            [
                district_id,
                row["date"],
                row["min"],
                row["max"],
                row["median"],
                row["q1"],
                row["q3"],
                row["stdev"],
                row["count"]
            ]
        )

conn.commit()
cursor.close()
conn.close()

print("Done! All CSV loaded successfully!")
