import pg8000

conn = pg8000.connect(
    database="airq_almaty",
    user="postgres",
    password="postgre",
    host="localhost",
    port=5432
)
cursor = conn.cursor()

breakpoints = [
    (0.0, 12.0, 0, 50),
    (12.1, 35.4, 51, 100),
    (35.5, 55.4, 101, 150),
    (55.5, 150.4, 151, 200),
    (150.5, 250.4, 201, 300),
    (250.5, 350.4, 301, 400),
    (350.5, 500.4, 401, 500)
]

def calculate_aqi(pm25):
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= pm25 <= c_high:
            return round((i_high - i_low) / (c_high - c_low) * (pm25 - c_low) + i_low)
    return None

cursor.execute("SELECT district_id, date, pm25_median FROM pm25_daily")
rows = cursor.fetchall()

for district_id, date, pm25 in rows:
    if pm25 is None:
        continue

    aqi = calculate_aqi(pm25)

    cursor.execute("""
        INSERT INTO daily_aqi (district_id, date, aqi)
        VALUES (%s, %s, %s)
    """, [district_id, date, aqi])

conn.commit()
cursor.close()
conn.close()

print("AQI calculation completed!")