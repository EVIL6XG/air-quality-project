def test_cart_requires_auth(client):
    response = client.get("/api/shop/cart")
    assert response.status_code == 401


def test_add_to_cart_requires_auth(client):
    response = client.post("/api/shop/cart/items", json={"product_id": 101, "qty": 1})
    assert response.status_code == 401


def test_add_to_cart_success(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "_get_token", lambda: "jwt-token")
    monkeypatch.setattr(app_module, "add_cart_item", lambda token, product_id, qty: (True, None))

    response = client.post("/api/shop/cart/items", json={"product_id": 101, "qty": 2})
    assert response.status_code == 200
    assert response.get_json()["ok"] is True


def test_checkout_success(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "_get_token", lambda: "jwt-token")
    monkeypatch.setattr(
        app_module,
        "checkout",
        lambda token: ({"order_id": 42, "total_cents": 17800, "currency": "USD"}, None),
    )

    response = client.post("/api/shop/checkout", json={})
    assert response.status_code == 201
    payload = response.get_json()
    assert payload["order_id"] == 42
    assert payload["currency"] == "USD"
