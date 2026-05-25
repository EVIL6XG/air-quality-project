from db import get_connection
from auth import get_user_from_token


PRODUCTS = [
    {"id": 101, "name": "AirQ Pocket Monitor", "price_cents": 8900, "currency": "USD"},
    {"id": 102, "name": "AirQ Home Sensor", "price_cents": 12900, "currency": "USD"},
    {"id": 103, "name": "District Alert Plan", "price_cents": 600, "currency": "USD"},
    {"id": 104, "name": "AirQ Urban Mask", "price_cents": 2900, "currency": "USD"},
    {"id": 105, "name": "Smog Protection Mask", "price_cents": 4900, "currency": "USD"},
    {"id": 106, "name": "AirQ Drive Monitor", "price_cents": 11900, "currency": "USD"},
    {"id": 201, "name": "Smog Cloud Edition", "price_cents": 5800, "currency": "USD"},
    {"id": 202, "name": "Mountain Air Edition", "price_cents": 5200, "currency": "USD"},
    {"id": 203, "name": "Urban AQI Edition", "price_cents": 5600, "currency": "USD"},
]


def _product_map():
    return {p["id"]: p for p in PRODUCTS}


def ensure_shop_tables():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS shop_products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
            currency TEXT NOT NULL DEFAULT 'USD',
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            stock INTEGER NOT NULL DEFAULT 999
        );
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            product_id INTEGER NOT NULL REFERENCES shop_products(id),
            qty INTEGER NOT NULL CHECK (qty > 0),
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, product_id)
        );
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status TEXT NOT NULL DEFAULT 'placed',
            total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
            currency TEXT NOT NULL DEFAULT 'USD',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    cur.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider TEXT")
    cur.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'")
    cur.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_session_id TEXT")
    cur.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT")
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER NOT NULL REFERENCES shop_products(id),
            qty INTEGER NOT NULL CHECK (qty > 0),
            unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
        );
        """
    )
    for p in PRODUCTS:
        cur.execute(
            """
            INSERT INTO shop_products (id, name, price_cents, currency, is_active, stock)
            VALUES (%s, %s, %s, %s, TRUE, 999)
            ON CONFLICT (id) DO UPDATE
            SET name = EXCLUDED.name,
                price_cents = EXCLUDED.price_cents,
                currency = EXCLUDED.currency
            """,
            [p["id"], p["name"], p["price_cents"], p["currency"]],
        )
    conn.commit()
    cur.close()
    conn.close()


def _require_user_id(token):
    user, err = get_user_from_token(token)
    if err:
        return None, err
    return user["id"], None


def list_products():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, price_cents, currency, stock FROM shop_products WHERE is_active = TRUE ORDER BY id"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {"id": r[0], "name": r[1], "price_cents": r[2], "currency": r[3], "stock": r[4]}
        for r in rows
    ]


def get_cart(token):
    user_id, err = _require_user_id(token)
    if err:
        return None, err
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT c.id, c.product_id, p.name, c.qty, p.price_cents, p.currency
        FROM cart_items c
        JOIN shop_products p ON p.id = c.product_id
        WHERE c.user_id = %s
        ORDER BY c.id
        """,
        [user_id],
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    items = [
        {
            "id": r[0],
            "product_id": r[1],
            "name": r[2],
            "qty": r[3],
            "price_cents": r[4],
            "currency": r[5],
            "line_total_cents": r[3] * r[4],
        }
        for r in rows
    ]
    total_cents = sum(i["line_total_cents"] for i in items)
    return {"items": items, "total_cents": total_cents, "currency": "USD"}, None


def add_cart_item(token, product_id, qty):
    user_id, err = _require_user_id(token)
    if err:
        return False, err
    product_id = int(product_id)
    qty = int(qty)
    if qty <= 0:
        return False, "qty must be positive"
    if product_id not in _product_map():
        return False, "unknown product"
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO cart_items (user_id, product_id, qty)
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, product_id) DO UPDATE
        SET qty = cart_items.qty + EXCLUDED.qty,
            updated_at = CURRENT_TIMESTAMP
        """,
        [user_id, product_id, qty],
    )
    conn.commit()
    cur.close()
    conn.close()
    return True, None


def update_cart_item(token, item_id, qty):
    user_id, err = _require_user_id(token)
    if err:
        return False, err
    qty = int(qty)
    conn = get_connection()
    cur = conn.cursor()
    if qty <= 0:
        cur.execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", [item_id, user_id])
    else:
        cur.execute(
            "UPDATE cart_items SET qty = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s AND user_id = %s",
            [qty, item_id, user_id],
        )
    conn.commit()
    cur.close()
    conn.close()
    return True, None


def remove_cart_item(token, item_id):
    user_id, err = _require_user_id(token)
    if err:
        return False, err
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM cart_items WHERE id = %s AND user_id = %s", [item_id, user_id])
    conn.commit()
    cur.close()
    conn.close()
    return True, None


def checkout(token):
    user_id, err = _require_user_id(token)
    if err:
        return None, err
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT c.product_id, c.qty, p.price_cents, p.currency, p.stock, p.name
        FROM cart_items c
        JOIN shop_products p ON p.id = c.product_id
        WHERE c.user_id = %s
        FOR UPDATE
        """,
        [user_id],
    )
    rows = cur.fetchall()
    if not rows:
        cur.close()
        conn.close()
        return None, "cart is empty"

    for r in rows:
        if r[1] > r[4]:
            cur.close()
            conn.close()
            return None, f"not enough stock for {r[5]}"

    total_cents = sum(r[1] * r[2] for r in rows)
    currency = rows[0][3]
    cur.execute(
        "INSERT INTO orders (user_id, status, total_cents, currency) VALUES (%s, 'placed', %s, %s) RETURNING id",
        [user_id, total_cents, currency],
    )
    order_id = cur.fetchone()[0]

    for r in rows:
        product_id, qty, unit_price = r[0], r[1], r[2]
        cur.execute(
            "INSERT INTO order_items (order_id, product_id, qty, unit_price_cents) VALUES (%s, %s, %s, %s)",
            [order_id, product_id, qty, unit_price],
        )
        cur.execute("UPDATE shop_products SET stock = stock - %s WHERE id = %s", [qty, product_id])

    cur.execute("DELETE FROM cart_items WHERE user_id = %s", [user_id])
    conn.commit()
    cur.close()
    conn.close()
    return {"order_id": order_id, "total_cents": total_cents, "currency": currency}, None


def list_orders(token):
    user_id, err = _require_user_id(token)
    if err:
        return None, err
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, status, total_cents, currency, created_at, payment_provider, payment_status
        FROM orders
        WHERE user_id = %s
        ORDER BY id DESC
        """,
        [user_id],
    )
    orders = []
    for oid, status, total, currency, created_at, provider, payment_status in cur.fetchall():
        cur.execute(
            """
            SELECT oi.product_id, p.name, oi.qty, oi.unit_price_cents
            FROM order_items oi
            JOIN shop_products p ON p.id = oi.product_id
            WHERE oi.order_id = %s
            ORDER BY oi.id
            """,
            [oid],
        )
        items = [
            {
                "product_id": r[0],
                "name": r[1],
                "qty": r[2],
                "unit_price_cents": r[3],
                "line_total_cents": r[2] * r[3],
            }
            for r in cur.fetchall()
        ]
        orders.append(
            {
                "id": oid,
                "status": status,
                "total_cents": total,
                "currency": currency,
                "created_at": str(created_at),
                "payment_provider": provider,
                "payment_status": payment_status,
                "items": items,
            }
        )
    cur.close()
    conn.close()
    return orders, None


def create_pending_order_for_payment(token):
    user_id, err = _require_user_id(token)
    if err:
        return None, err

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT c.product_id, c.qty, p.price_cents, p.currency, p.stock, p.name
        FROM cart_items c
        JOIN shop_products p ON p.id = c.product_id
        WHERE c.user_id = %s
        FOR UPDATE
        """,
        [user_id],
    )
    rows = cur.fetchall()
    if not rows:
        cur.close()
        conn.close()
        return None, "cart is empty"

    for r in rows:
        if r[1] > r[4]:
            cur.close()
            conn.close()
            return None, f"not enough stock for {r[5]}"

    total_cents = sum(r[1] * r[2] for r in rows)
    currency = rows[0][3]
    cur.execute(
        """
        INSERT INTO orders (user_id, status, total_cents, currency, payment_provider, payment_status)
        VALUES (%s, 'pending_payment', %s, %s, 'stripe', 'pending')
        RETURNING id
        """,
        [user_id, total_cents, currency],
    )
    order_id = cur.fetchone()[0]

    for r in rows:
        product_id, qty, unit_price = r[0], r[1], r[2]
        cur.execute(
            "INSERT INTO order_items (order_id, product_id, qty, unit_price_cents) VALUES (%s, %s, %s, %s)",
            [order_id, product_id, qty, unit_price],
        )
    conn.commit()
    cur.close()
    conn.close()
    return {"order_id": order_id, "total_cents": total_cents, "currency": currency}, None


def attach_checkout_session(order_id, session_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE orders SET checkout_session_id = %s WHERE id = %s",
        [session_id, order_id],
    )
    conn.commit()
    cur.close()
    conn.close()


def mark_order_paid_by_session(session_id, payment_intent_id=None):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, user_id, status
        FROM orders
        WHERE checkout_session_id = %s
        LIMIT 1
        FOR UPDATE
        """,
        [session_id],
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return False, "order not found"

    order_id, user_id, status = row
    if status == "paid":
        cur.close()
        conn.close()
        return True, None

    cur.execute(
        """
        SELECT oi.product_id, oi.qty, p.stock, p.name
        FROM order_items oi
        JOIN shop_products p ON p.id = oi.product_id
        WHERE oi.order_id = %s
        FOR UPDATE
        """,
        [order_id],
    )
    items = cur.fetchall()
    for product_id, qty, stock, name in items:
        if qty > stock:
            cur.close()
            conn.close()
            return False, f"not enough stock for {name}"
        cur.execute("UPDATE shop_products SET stock = stock - %s WHERE id = %s", [qty, product_id])

    cur.execute(
        """
        UPDATE orders
        SET status = 'paid',
            payment_status = 'paid',
            payment_intent_id = %s
        WHERE id = %s
        """,
        [payment_intent_id, order_id],
    )
    cur.execute("DELETE FROM cart_items WHERE user_id = %s", [user_id])
    conn.commit()
    cur.close()
    conn.close()
    return True, None
