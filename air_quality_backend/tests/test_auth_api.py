def test_login_requires_email_and_password(client):
    response = client.post("/api/auth/login", json={})
    assert response.status_code == 400
    assert "required" in response.get_json()["error"].lower()


def test_login_success_returns_token(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "login_user", lambda email, password: ("token-123", None))
    response = client.post("/api/auth/login", json={"email": "user@example.com", "password": "password123"})
    assert response.status_code == 200
    assert response.get_json()["token"] == "token-123"


def test_me_requires_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
    assert "missing token" in response.get_json()["error"].lower()
