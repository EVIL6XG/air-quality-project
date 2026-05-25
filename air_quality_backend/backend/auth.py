import jwt
import datetime
import os
import secrets
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_connection

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

SECRET_KEY = "change-this-secret-in-production"
RESET_TOKEN_MINUTES = 24 * 60


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


def request_password_reset(email):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMP NOT NULL,
            used_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()

    cur.execute("SELECT id FROM users WHERE email = %s", [email])
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return {"sent": True}, None

    user_id = row[0]
    # Invalidate all previous active reset tokens for this user.
    cur.execute(
        """
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE user_id = %s AND used_at IS NULL
        """,
        [user_id],
    )
    token = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=RESET_TOKEN_MINUTES)

    cur.execute(
        """
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES (%s, %s, %s)
        """,
        [user_id, token, expires_at],
    )
    conn.commit()
    cur.close()
    conn.close()

    reset_url = f"{os.getenv('FRONTEND_URL', 'http://127.0.0.1:3000')}/reset-password?token={token}"
    email_sent = _send_password_reset_email(email, reset_url)
    response = {"sent": True}
    if not email_sent:
        response["dev_reset_url"] = reset_url
    return response, None


def reset_password(token, new_password):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT user_id
        FROM password_reset_tokens
        WHERE token = %s AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP
        """,
        [token],
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return False, "Invalid or expired reset token"

    password_hash = generate_password_hash(new_password)
    cur.execute(
        "UPDATE users SET password_hash = %s WHERE id = %s",
        [password_hash, row[0]],
    )
    cur.execute(
        "UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE token = %s",
        [token],
    )
    conn.commit()
    cur.close()
    conn.close()
    return True, None


def _send_password_reset_email(email, reset_url):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    mail_from = os.getenv("MAIL_FROM", smtp_user or "noreply@airq.local")

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"Password reset link for {email}: {reset_url}")
        return False

    msg = EmailMessage()
    msg["Subject"] = "Reset your AirQ password"
    msg["From"] = mail_from
    msg["To"] = email
    msg.set_content(
        "Use this link to reset your AirQ password. "
        f"The link expires in {RESET_TOKEN_MINUTES} minutes.\n\n{reset_url}"
    )

    with smtplib.SMTP(smtp_host, smtp_port) as server:
      server.starttls()
      server.login(smtp_user, smtp_password)
      server.send_message(msg)
    return True


def _make_token(user_id, email):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
