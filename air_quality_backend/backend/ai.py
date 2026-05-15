import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from db import get_connection
import datetime
from dateutil.parser import parse


DISTRICTS = {
    "бостандык": 1,
    "бостандыкский": 1,
    "bostandyk": 1,

    "медеу": 2,
    "медеуский": 2,
    "medeu": 2,

    "ауэзов": 3,
    "аузов": 3,
    "аузовский": 3,
    "auezov": 3,

    "алатау": 4,
    "алатауский": 4,
    "alatau": 4,

    "жетысу": 5,
    "жетісу": 5,
    "jetisu": 5
}


def detect_district(text: str):
    text = text.lower()
    for name, district_id in DISTRICTS.items():
        if name in text:
            return district_id
    return None


def detect_date(text: str):
    text = text.lower()
    today = datetime.date.today()

    # вчера
    if "вчера" in text:
        return str(today - datetime.timedelta(days=1))

    # позавчера
    if "позавчера" in text:
        return str(today - datetime.timedelta(days=2))

    # n дней назад
    import re
    match = re.search(r"(\d+)\s+дн", text)
    if match:
        days = int(match.group(1))
        return str(today - datetime.timedelta(days=days))

    # попытаться распарсить конкретную дату
    try:
        parsed = parse(text, fuzzy=True, dayfirst=True)
        return str(parsed.date())
    except Exception:
        pass

    return None



def get_aqi_from_db(district_id: int, date: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT aqi
        FROM daily_aqi
        WHERE district_id = %s AND date = %s
    """, (district_id, date))

    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return None
    return row[0]



def make_recommendations(aqi: int):
    if aqi <= 50:
        return "Качество воздуха хорошее — можно спокойно проводить время на улице."
    elif aqi <= 100:
        return "Воздух умеренно загрязнён. Людям с астмой и аллергией стоит соблюдать осторожность."
    elif aqi <= 150:
        return "Вредно для чувствительных групп — детям, пожилым людям и аллергикам лучше ограничить прогулки."
    elif aqi <= 200:
        return "Нездоровый уровень — рекомендуется надеть маску, избегать активности на улице."
    else:
        return "Очень вредно — желательно оставаться дома и закрыть окна."


functions = [
    {
        "name": "get_aqi_from_db",
        "description": "Get historical AQI for given district and date",
        "parameters": {
            "type": "object",
            "properties": {
                "district_id": {"type": "integer"},
                "date": {"type": "string", "description": "Date YYYY-MM-DD"}
            },
            "required": ["district_id", "date"]
        }
    }
]

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def ai_answer(user_message: str):

    district = detect_district(user_message)
    date = detect_date(user_message)

    if district and date:
        aqi = get_aqi_from_db(district, date)
        if aqi is None:
            return f"К сожалению, у меня нет данных по этой дате ({date})."

        rec = make_recommendations(aqi)
        return f"""
AQI в выбранном районе на {date}: **{aqi}**
{rec}
        """
    system_prompt = """
Ты — AI-помощник по качеству воздуха Алматы.
Если пользователь спрашивает AQI за определённую дату —
и тебе известны район и дата — сразу отвечай.
Если нет — вежливо попроси указать недостающую информацию.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        functions=functions,
        function_call="auto"
    )

    msg = response.choices[0].message

    # Если есть function_call — обрабатываем
    if msg.function_call:
        args = json.loads(msg.function_call.arguments)

        district_id = args.get("district_id") or district
        date_str = args.get("date") or date

        if not district_id:
            return "Пожалуйста, укажите район Алматы."

        if not date_str:
            return "Пожалуйста, укажите дату."

        aqi = get_aqi_from_db(district_id, date_str)

        if aqi is None:
            return f"Нет данных по дате {date_str}."

        rec = make_recommendations(aqi)

        return f"AQI: {aqi}\nДата: {date_str}\n{rec}"

    # Если function_call НЕТ — берём обычный текст
    text = msg.content
    if not text:
        return "Извините, я не смог обработать запрос. Уточните, пожалуйста, район и дату."

    return text


