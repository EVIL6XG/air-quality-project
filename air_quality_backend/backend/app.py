import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from queries import (get_latest_aqi_per_district, get_aqi_by_date_and_district,
                     get_aqi_by_date, get_all_districts, get_aqi_history, get_pm25_history, get_stats_summary)
from ai import ai_answer
from forecast import get_forecast, get_recent_history
from forecast_dl import get_forecast_dl, get_recent_history_dl, get_dl_runtime_status
from auth import (
    get_user_from_token,
    login_user,
    register_user,
    request_password_reset,
    reset_password,
    update_user_avatar,
    update_user_profile,
)
from shop import (
    ensure_shop_tables,
    list_products,
    get_cart,
    add_cart_item,
    update_cart_item,
    remove_cart_item,
    checkout,
    list_orders,
    create_pending_order_for_payment,
    attach_checkout_session,
    mark_order_paid_by_session,
)

try:
    import stripe
except Exception:
    stripe = None

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}

app = Flask(__name__)
CORS(app, allow_headers=["Content-Type", "Authorization"])
# Allows isolated API tests to import this module without requiring DB bootstrap.
if os.getenv("SKIP_DB_INIT") != "1":
    ensure_shop_tables()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
if stripe and STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY


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
    model = (request.args.get("model") or "ml").lower()

    if model == "dl":
        history = get_recent_history_dl(district_id, days=60)
        predictions = get_forecast_dl(district_id, days=days)
    else:
        history = get_recent_history(district_id, days=60)
        predictions = get_forecast(district_id, days=days)

    if predictions is None:
        payload = {"error": "Not enough data or model is not trained"}
        if model == "dl":
            payload["dl_status"] = get_dl_runtime_status(district_id)
        return jsonify(payload), 400
    return jsonify({"history": history, "forecast": predictions, "model": model})


@app.route("/api/forecast-dl")
def forecast_dl():
    district_id = request.args.get("district_id", 1)
    days = int(request.args.get("days", 7))
    history = get_recent_history_dl(district_id, days=60)
    predictions = get_forecast_dl(district_id, days=days)
    if predictions is None:
        return jsonify({
            "error": "Deep learning model is not trained yet",
            "dl_status": get_dl_runtime_status(district_id),
        }), 400
    return jsonify({"history": history, "forecast": predictions, "model": "dl"})


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


@app.route("/api/shop/products")
def shop_products():
    return jsonify(list_products())


@app.route("/api/shop/cart")
def shop_cart():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    data, err = get_cart(token)
    if err:
        return jsonify({"error": err}), 401
    return jsonify(data)


@app.route("/api/shop/cart/items", methods=["POST"])
def shop_add_cart_item():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    payload = request.get_json() or {}
    product_id = payload.get("product_id")
    qty = payload.get("qty", 1)
    if product_id is None:
        return jsonify({"error": "product_id is required"}), 400
    ok, err = add_cart_item(token, product_id, qty)
    if err:
        return jsonify({"error": err}), 400
    return jsonify({"ok": ok})


@app.route("/api/shop/cart/items/<int:item_id>", methods=["PATCH"])
def shop_update_cart_item(item_id):
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    payload = request.get_json() or {}
    qty = payload.get("qty")
    if qty is None:
        return jsonify({"error": "qty is required"}), 400
    ok, err = update_cart_item(token, item_id, qty)
    if err:
        return jsonify({"error": err}), 400
    return jsonify({"ok": ok})


@app.route("/api/shop/cart/items/<int:item_id>", methods=["DELETE"])
def shop_remove_cart_item(item_id):
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    ok, err = remove_cart_item(token, item_id)
    if err:
        return jsonify({"error": err}), 400
    return jsonify({"ok": ok})


@app.route("/api/shop/checkout", methods=["POST"])
def shop_checkout():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    data, err = checkout(token)
    if err:
        return jsonify({"error": err}), 400
    return jsonify(data), 201


@app.route("/api/shop/orders")
def shop_orders():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    data, err = list_orders(token)
    if err:
        return jsonify({"error": err}), 401
    return jsonify(data)


@app.route("/api/payments/create-checkout-session", methods=["POST"])
def create_checkout_session():
    token = _get_token()
    if not token:
        return jsonify({"error": "Missing token"}), 401
    if not stripe or not STRIPE_SECRET_KEY:
        return jsonify({"error": "Stripe is not configured on backend"}), 400

    payload = request.get_json() or {}
    origin = payload.get("origin") or "http://127.0.0.1:5173"

    order, err = create_pending_order_for_payment(token)
    if err:
        return jsonify({"error": err}), 400

    cart, cart_err = get_cart(token)
    if cart_err:
        return jsonify({"error": cart_err}), 400

    line_items = []
    for item in cart["items"]:
        line_items.append(
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": item["name"]},
                    "unit_amount": int(item["price_cents"]),
                },
                "quantity": int(item["qty"]),
            }
        )

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=line_items,
            success_url=f"{origin}/shop/orders?paid=1",
            cancel_url=f"{origin}/shop/cart?canceled=1",
            metadata={"order_id": str(order["order_id"])},
        )
    except Exception as e:
        return jsonify({"error": f"Stripe checkout create failed: {str(e)}"}), 400
    attach_checkout_session(order["order_id"], session.id)
    return jsonify({"checkout_url": session.url, "session_id": session.id, "order_id": order["order_id"]})


@app.route("/api/payments/webhook", methods=["POST"])
def stripe_webhook():
    if not stripe or not STRIPE_SECRET_KEY:
        return jsonify({"error": "Stripe not configured"}), 400
    payload = request.get_data()
    sig = request.headers.get("Stripe-Signature", "")

    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(payload=payload, sig_header=sig, secret=STRIPE_WEBHOOK_SECRET)
        else:
            event = request.get_json()
    except Exception as e:
        return jsonify({"error": f"Invalid webhook: {str(e)}"}), 400

    event_type = event.get("type")
    if event_type == "checkout.session.completed":
        session_obj = event["data"]["object"]
        session_id = session_obj.get("id")
        payment_intent_id = session_obj.get("payment_intent")
        mark_order_paid_by_session(session_id, payment_intent_id)

    return jsonify({"received": True})


@app.route("/")
def home():
    return "AirQAlmaty API is running!"


if __name__ == "__main__":
    app.run(debug=True)
