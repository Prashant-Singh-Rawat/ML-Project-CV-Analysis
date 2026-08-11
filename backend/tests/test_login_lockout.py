"""Concurrency-oriented lockout tests."""

import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_parallel_failed_logins_engage_lockout():
    try:
        from auth import user_db
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    email = f"lock_{os.getpid()}@example.com"
    reg = client.post(
        "/auth/register",
        json={
            "email": email,
            "name": "Lock User",
            "password": "StrongPass1!",
            "device_fingerprint": "fp-lock-1",
        },
    )
    assert reg.status_code == 200, reg.text

    def bad_login(_):
        return client.post(
            "/auth/login",
            json={
                "email": email,
                "password": "WrongPass1!",
                "device_fingerprint": "fp-lock-1",
            },
        ).status_code

    with ThreadPoolExecutor(max_workers=10) as pool:
        statuses = list(pool.map(bad_login, range(12)))

    assert any(code == 401 for code in statuses)
    user = user_db.get_user_by_email(email)
    assert user["failed_attempts"] >= 5
    assert user.get("locked_until")

    locked = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "StrongPass1!",
            "device_fingerprint": "fp-lock-1",
        },
    )
    assert locked.status_code == 423
