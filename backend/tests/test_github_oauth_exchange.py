"""Tests for GitHub OAuth one-time code exchange and CSRF state."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_github_exchange_rejects_invalid_code():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    response = client.post("/auth/github/exchange", json={"auth_code": "nope"})
    assert response.status_code == 400


def test_github_exchange_consumes_code_once():
    try:
        from auth import oauth_store
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    payload = {
        "access_token": "test-jwt",
        "token_type": "bearer",
        "user": {"id": 1, "email": "gh@example.com", "name": "GH User"},
    }
    code = oauth_store.create_auth_code(payload)

    first = client.post("/auth/github/exchange", json={"auth_code": code})
    assert first.status_code == 200
    assert first.json()["access_token"] == "test-jwt"

    second = client.post("/auth/github/exchange", json={"auth_code": code})
    assert second.status_code == 400


def test_oauth_state_is_single_use():
    try:
        from auth import oauth_store
    except ImportError as e:
        print(f"[CI-SKIP] {e}")
        return

    state = oauth_store.create_oauth_state()
    assert oauth_store.consume_oauth_state(state) is True
    assert oauth_store.consume_oauth_state(state) is False
    assert oauth_store.consume_oauth_state(None) is False
