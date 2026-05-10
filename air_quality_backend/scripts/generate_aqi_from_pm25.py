import pg8000
import math

# --- AQI расчет по EPA для PM2.5 ---
def calculate_aqi(pm25):
    if pm25 is None:
        return None

    try:
        pm25 = float(pm25)
    except (TypeError, ValueError):
        return None

    if pm25 < 0:
        return None

    # EPA rule: truncate to 1 decimal (НЕ округлять!)
    pm25 = math.floor(pm25 * 10) / 10.0

    breakpoints = [
        (0.0, 12.0, 0, 50),
        (12.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 150.4, 151, 200),
        (150.5, 250.4, 201, 300),
        (250.5, 350.4, 301, 400),
        (350.5, 500.4, 401, 500),
    ]

    for bp_low, bp_high, aqi_low, aqi_high in breakpoints:
        if bp_low <= pm25 <= bp_high:
            return round(
                (aqi_high - aqi_low)
                / (bp_high - bp_low)
                * (pm25 - bp_low)
                + aqi_low
            )

    # если PM2.5 выше максимума EPA
    if pm25 > 500.4:
        return 500

    return None


def get_category_and_level(aqi):
    if aqi is None:
        return "Unknown", "gray"

    if aqi <= 50:
        return "Good", "green"
    if aqi <= 100:
        return "Moderate", "yellow"
    if aqi <= 150:
        return "Unhealthy for Sensitive Groups", "orange"
    if aqi <= 200:
        return "Unhealthy", "red"
    if aqi <= 300:
        return "Very Unhealthy", "purple"
    return "Hazardous", "maroon"


print("Connecting to DB...")

conn = pg8000.connect(
    database="airq_almaty",
    user="postgres",
    password="postgre",
    host="localhost",
    port=5432
)
cursor = conn.cursor()

cursor.execute("""
    SELECT district_id, date, pm25_median
    FROM pm25_daily
    ORDER BY date;
""")

rows = cursor.fetchall()
print(f"Found {len(rows)} PM2.5 rows")

count_inserted = 0
count_skipped = 0

for district_id, date, pm25 in rows:
    aqi = calculate_aqi(pm25)
    if aqi is None:
        count_skipped += 1
        continue

    category, level = get_category_and_level(aqi)

    cursor.execute("""
        SELECT 1 FROM daily_aqi
        WHERE district_id = %s AND date = %s
    """, (district_id, date))

    if cursor.fetchone():
        continue

    cursor.execute("""
        INSERT INTO daily_aqi (district_id, date, aqi, category, level)
        VALUES (%s, %s, %s, %s, %s)
    """, (district_id, date, aqi, category, level))

    count_inserted += 1

conn.commit()
cursor.close()
conn.close()

print(f"✓ Done! Inserted {count_inserted} AQI rows into daily_aqi.")
print(f"↪ Skipped {count_skipped} rows (invalid PM2.5)")
