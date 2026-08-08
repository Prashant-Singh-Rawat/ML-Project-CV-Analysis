"""Auth regression tests for /auth/update-settings."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_update_settings_requires_auth():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    response = client.post(
        "/auth/update-settings",
        json={
            "email": "victim@example.com",
            "phone": "+10000000000",
            "updates_enabled": False,
        },
    )
    assert response.status_code == 401


def test_update_settings_uses_token_subject_not_body_email():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    email = f"settings_{os.getpid()}@example.com"
    reg = client.post(
        "/auth/register",
        json={
            "email": email,
            "name": "Settings User",
            "password": "StrongPass1!",
            "device_fingerprint": "fp-settings-1",
        },
    )
    assert reg.status_code == 200, reg.text
    token = reg.json()["access_token"]

    response = client.post(
        "/auth/update-settings",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "email": "attacker-target@example.com",
            "phone": "+15551234567",
            "updates_enabled": False,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == email
    assert data["user"]["phone"] == "+15551234567"
    assert data["user"]["updates_enabled"] is False
