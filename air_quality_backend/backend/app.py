import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from queries import (get_latest_aqi_per_district, get_aqi_by_date_and_district,
                     get_aqi_by_date, get_all_districts, get_aqi_history, get_pm25_history, get_stats_summary)
from ai import ai_answer
from forecast import get_forecast, get_recent_history
from auth import (
    get_user_from_token,
    login_user,
    register_user,
    request_password_reset,
    reset_password,
    update_user_avatar,
    update_user_profile,
)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

app = Flask(__name__)
CORS(app, allow_headers=["Content-Type", "Authorization"])


def _get_token():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    return auth[7:]


def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/aqi/latest")
def latest_aqi():
    data = get_latest_aqi_per_district()
    return jsonify(data)


@app.route("/api/aqi/by-date")
def aqi_by_date():
    date = request.args.get("date")
    district_id = request.args.get("district_id")

    if not date:
        return jsonify({"error": "date is required"}), 400

    if district_id:
        data = get_aqi_by_date_and_district(date, district_id)
        return jsonify(data if data else {})
    else:
        data = get_aqi_by_date(date)
        return jsonify(data)


@app.route("/api/districts")
def districts():
    data = get_all_districts()
    return jsonify(data)


@app.route("/api/aqi/history/<district_id>")
def aqi_history(district_id):
    data = get_aqi_history(district_id)
    return jsonify(data)


@app.route("/api/pm25/history/<district_id>")
def pm25_history(district_id):
    data = get_pm25_history(district_id)
    return jsonify(data)


@app.route("/api/stats/summary")
def starts_summary():
    data = get_stats_summary()
    return jsonify(data)


@app.route("/api/forecast")
def forecast():
    district_id = request.args.get("district_id", 1)
    days = int(request.args.get("days", 7))
    history = get_recent_history(district_id, days=60)
    predictions = get_forecast(district_id, days=days)
    if predictions is None:
        return jsonify({"error": "Not enough data for forecast"}), 400
    return jsonify({"history": history, "forecast": predictions})


@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    email = (data or {}).get("email", "").strip()
    password = (data or {}).get("password", "")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    token, error = register_user(email, password)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"token": token}), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = (data or {}).get("email", "").strip()
    password = (data or {}).get("password", "")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    token, error = login_user(email, password)
    if error:
        return jsonify({"error": error}), 401
    return jsonify({"token": token})


@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = (data or {}).get("email", "").strip()

    if not email:
        return jsonify({"error": "email is required"}), 400

    result, error = request_password_reset(email)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(result)


@app.route("/api/auth/reset-password", methods=["POST"])
def reset_user_password():
    data = request.get_json()
    token = (data or {}).get("token", "").strip()
    password = (data or {}).get("password", "")

    if not token or not password:
        return jsonify({"error": "token and password are required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    ok, error = reset_password(token, password)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"ok": ok})


@app.route("/api/auth/me")
def me():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    user, error = get_user_from_token(token)
    if error:
        return jsonify({"error": error}), 401
    return jsonify(user)


@app.route("/api/auth/update-profile", methods=["POST"])
def update_profile():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    data = request.get_json()
    name = (data or {}).get("name", "").strip()
    ok, error = update_user_profile(token, name)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"ok": True})


@app.route("/api/auth/upload-avatar", methods=["POST"])
def upload_avatar():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files["file"]
    if not _allowed(file.filename):
        return jsonify({"error": "Only PNG, JPG, JPEG, WEBP allowed"}), 400

    filename = secure_filename(f"avatar_{token[:8]}_{file.filename}")
    file.save(os.path.join(UPLOAD_FOLDER, filename))

    ok, error = update_user_avatar(token, filename)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"avatar": filename})


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"error": "message field is required"}), 400

    user_message = data["message"]
    answer = ai_answer(user_message)
    return jsonify({"response": answer})


@app.route("/")
def home():
    return "AirQAlmaty API is running!"


if __name__ == "__main__":
    app.run(debug=True)
