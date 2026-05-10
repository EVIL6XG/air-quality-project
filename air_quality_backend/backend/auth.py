import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

SECRET_KEY = "change-this-secret-in-production"


def _decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"]), None
    except jwt.ExpiredSignatureError:
        return None, "Token expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"


def get_user_from_token(token):
    payload, err = _decode_token(token)
    if err:
        return None, err

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, email, name, avatar, created_at FROM users WHERE id = %s",
        [payload["user_id"]],
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return None, "User not found"

    return {
        "id": row[0],
        "email": row[1],
        "name": row[2],
        "avatar": row[3],
        "created_at": str(row[4]),
    }, None


def update_user_profile(token, name):
    payload, err = _decode_token(token)
    if err:
        return False, err

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET name = %s WHERE id = %s",
        [name, payload["user_id"]],
    )
    conn.commit()
    cur.close()
    conn.close()
    return True, None


def update_user_avatar(token, filename):
    payload, err = _decode_token(token)
    if err:
        return False, err

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET avatar = %s WHERE id = %s",
        [filename, payload["user_id"]],
    )
    conn.commit()
    cur.close()
    conn.close()
    return True, None


def register_user(email, password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", [email])
    if cur.fetchone():
        cur.close()
        conn.close()
        return None, "User already exists"

    hashed = generate_password_hash(password)
    cur.execute(
        "INSERT INTO users (email, password_hash) VALUES (%s, %s) RETURNING id",
        [email, hashed],
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return _make_token(user_id, email), None


def login_user(email, password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, password_hash FROM users WHERE email = %s", [email])
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row or not check_password_hash(row[1], password):
        return None, "Invalid email or password"

    return _make_token(row[0], email), None


def _make_token(user_id, email):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
