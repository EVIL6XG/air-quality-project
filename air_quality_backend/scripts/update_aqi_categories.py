import pg8000

conn = pg8000.connect(
    database="airq_almaty",
    user="postgres",
    password="postgre",
    host="localhost",
    port=5432
)
cursor = conn.cursor()

def get_category_and_level(aqi):
    if 0 <= aqi <= 50:
        return "Good", "green"
    elif 51 <= aqi <= 100:
        return "Moderate", "yellow"
    elif 101 <= aqi <= 150:
        return "Unhealthy for Sensitive Groups", "orange"
    elif 151 <= aqi <= 200:
        return "Unhealthy", "red"
    elif 201 <= aqi <= 300:
        return "Very Unhealthy", "purple"
    else:
        return "Hazardous", "maroon"

cursor.execute("SELECT id, aqi FROM daily_aqi")
rows = cursor.fetchall()

for row_id, aqi in rows:
    if aqi is None:
        continue

    category, level = get_category_and_level(aqi)

    cursor.execute("""
        UPDATE daily_aqi
        SET category = %s,
            level = %s
        WHERE id = %s
    """, [category, level, row_id])

conn.commit()
cursor.close()
conn.close()

print("AQI categories updated!")
