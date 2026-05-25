class DummyStripeSession:
    id = "cs_test_123"
    url = "https://checkout.stripe.test/session/123"


class DummyStripeCheckout:
    class Session:
        @staticmethod
        def create(**kwargs):
            return DummyStripeSession()


class DummyStripeWebhook:
    @staticmethod
    def construct_event(payload, sig_header, secret):
        return {
            "type": "checkout.session.completed",
            "data": {"object": {"id": "cs_test_123", "payment_intent": "pi_123"}},
        }


class DummyStripe:
    checkout = DummyStripeCheckout()
    Webhook = DummyStripeWebhook()


def test_create_checkout_session_requires_stripe_config(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "_get_token", lambda: "jwt-token")
    monkeypatch.setattr(app_module, "stripe", None)
    monkeypatch.setattr(app_module, "STRIPE_SECRET_KEY", "")

    response = client.post("/api/payments/create-checkout-session", json={"origin": "http://127.0.0.1:3000"})
    assert response.status_code == 400
    assert "not configured" in response.get_json()["error"].lower()


def test_create_checkout_session_success(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "_get_token", lambda: "jwt-token")
    monkeypatch.setattr(app_module, "stripe", DummyStripe())
    monkeypatch.setattr(app_module, "STRIPE_SECRET_KEY", "sk_test_abc")
    monkeypatch.setattr(
        app_module,
        "create_pending_order_for_payment",
        lambda token: ({"order_id": 7, "total_cents": 1000, "currency": "USD"}, None),
    )
    monkeypatch.setattr(
        app_module,
        "get_cart",
        lambda token: ({"items": [{"name": "Mask", "price_cents": 1000, "qty": 1}]}, None),
    )
    attached = {}
    monkeypatch.setattr(app_module, "attach_checkout_session", lambda oid, sid: attached.update({"oid": oid, "sid": sid}))

    response = client.post("/api/payments/create-checkout-session", json={"origin": "http://127.0.0.1:3000"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["session_id"] == "cs_test_123"
    assert attached == {"oid": 7, "sid": "cs_test_123"}


def test_stripe_webhook_marks_order_paid(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "stripe", DummyStripe())
    monkeypatch.setattr(app_module, "STRIPE_SECRET_KEY", "sk_test_abc")
    monkeypatch.setattr(app_module, "STRIPE_WEBHOOK_SECRET", "whsec_abc")
    called = {}
    monkeypatch.setattr(
        app_module,
        "mark_order_paid_by_session",
        lambda session_id, payment_intent_id: called.update({"session_id": session_id, "payment_intent_id": payment_intent_id}),
    )

    response = client.post(
        "/api/payments/webhook",
        data=b"{}",
        headers={"Stripe-Signature": "t=1,v1=fake"},
        content_type="application/json",
    )

    assert response.status_code == 200
    assert called["session_id"] == "cs_test_123"
    assert called["payment_intent_id"] == "pi_123"
