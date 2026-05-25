def test_protected_orders_route_requires_auth(client):
    response = client.get("/api/shop/orders")
    assert response.status_code == 401


def test_protected_checkout_route_requires_auth(client):
    response = client.post("/api/shop/checkout", json={})
    assert response.status_code == 401
