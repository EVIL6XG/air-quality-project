from db import get_connection

def get_latest_aqi_per_district():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT ON (d.id)
               d.id,
               d.name,
               a.date,
               a.aqi,
               a.category,
               a.level
        FROM daily_aqi a
        JOIN districts d ON d.id = a.district_id
        ORDER BY d.id, a.date DESC;
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {
            "district_id": r[0],
            "district": r[1],
            "date": str(r[2]),
            "aqi": r[3],
            "category": r[4],
            "level": r[5]
        }
        for r in rows
    ]

def get_aqi_by_date(date):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT d.id, d.name, a.aqi, a.category, a.level
        FROM daily_aqi a
        JOIN districts d ON d.id = a.district_id
        WHERE a.date = %s
        ORDER BY d.id;
    """, [date])

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {
            "district_id": r[0],
            "district": r[1],
            "aqi": r[2],
            "category": r[3],
            "level": r[4]
        }
        for r in rows
    ]


def get_aqi_by_date_and_district(date, district_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT d.name, a.aqi, a.category, a.level
        FROM daily_aqi a
        JOIN districts d ON d.id = a.district_id
        WHERE a.date = %s AND a.district_id = %s
        LIMIT 1;
    """, [date, district_id])

    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        return {
            "district": row[0],
            "aqi": row[1],
            "category": row[2],
            "level": row[3]
        }

    return None


def get_aqi_history(district_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT date, aqi, category, level
        FROM daily_aqi
        WHERE district_id = %s
        ORDER BY date;
    """, [district_id])

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {
            "date": str(r[0]),
            "aqi": r[1],
            "category": r[2],
            "level": r[3]
        }
        for r in rows
    ]

def get_pm25_history(district_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT date, pm25_min, pm25_max, pm25_median,
               pm25_q1, pm25_q3, pm25_stdev, pm25_count
        FROM pm25_daily
        WHERE district_id = %s
        ORDER BY date;
    """, [district_id])

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {
            "date": str(r[0]),
            "pm25_min": r[1],
            "pm25_max": r[2],
            "pm25_median": r[3],
            "q1": r[4],
            "q3": r[5],
            "stdev": r[6],
            "count": r[7]
        }
        for r in rows
    ]

def get_stats_summary():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT d.name,
            ROUND(AVG(a.aqi) FILTER (WHERE a.date >= CURRENT_DATE - INTERVAL '7 days'), 2) AS avg_7_days,
            ROUND(AVG(a.aqi) FILTER (WHERE a.date >= CURRENT_DATE - INTERVAL '30 days'), 2) AS avg_30_days
        FROM daily_aqi a
        JOIN districts d ON d.id = a.district_id
        GROUP BY d.id, d.name
        ORDER BY d.id;
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {
            "district": r[0],
            "avg_7_days": r[1],
            "avg_30_days": r[2]
        }
        for r in rows
    ]
def get_all_districts():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name
        FROM districts
        ORDER BY id;
    """)

    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [{"id": r[0], "name": r[1]} for r in rows]

