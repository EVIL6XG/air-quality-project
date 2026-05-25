def test_forecast_ml_success(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "get_recent_history", lambda district_id, days=60: [{"date": "2026-05-01", "pm25": 40}])
    monkeypatch.setattr(app_module, "get_forecast", lambda district_id, days=7: [{"date": "2026-05-02", "pm25": 42}])

    response = client.get("/api/forecast?district_id=1&days=7&model=ml")
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["model"] == "ml"
    assert len(payload["forecast"]) == 1


def test_forecast_dl_not_trained(client, monkeypatch, app_module):
    monkeypatch.setattr(app_module, "get_recent_history_dl", lambda district_id, days=60: [])
    monkeypatch.setattr(app_module, "get_forecast_dl", lambda district_id, days=7: None)
    monkeypatch.setattr(app_module, "get_dl_runtime_status", lambda district_id: {"trained": False})

    response = client.get("/api/forecast?district_id=1&days=7&model=dl")
    assert response.status_code == 400
    payload = response.get_json()
    assert "error" in payload
    assert payload["dl_status"]["trained"] is False
