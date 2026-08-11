"""Regression tests for Google Sign-In token verification."""

import os
import sys
from unittest.mock import AsyncMock, patch

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_google_auth_rejects_unverified_token():
    """Forged bodies without a valid Google ID token must not issue a JWT."""
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    with patch(
        "auth.auth_utils.verify_google_id_token",
        new_callable=AsyncMock,
        side_effect=ValueError("Invalid or expired Google ID token."),
    ):
        response = client.post(
            "/auth/google",
            json={
                "google_id_token": "not-a-real-token",
                "name": "Attacker",
                "email": "victim@example.com",
                "google_id": "attacker-sub",
                "device_fingerprint": "attacker-device",
            },
        )

    assert response.status_code == 401
    assert "access_token" not in response.json()


def test_google_auth_uses_verified_claims_not_body_identity():
    """After verification, identity must come from claims, not request body fields."""
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    unique = f"verified_{os.getpid()}@example.com"
    verified = {
        "email": unique,
        "google_id": f"google-sub-{os.getpid()}",
        "name": "Verified User",
    }

    with patch(
        "auth.auth_utils.verify_google_id_token",
        new_callable=AsyncMock,
        return_value=verified,
    ):
        response = client.post(
            "/auth/google",
            json={
                "google_id_token": "valid-looking-token",
                "name": "Spoofed Name",
                "email": "spoofed@evil.example",
                "google_id": "spoofed-sub",
                "device_fingerprint": "device-fp-1",
            },
        )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == unique
    assert data["user"]["name"] == "Verified User"
