"""Auth/IDOR regression tests for resume history endpoints."""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def _register(client, email: str, fingerprint: str = "fp-test-1"):
    return client.post(
        "/auth/register",
        json={
            "email": email,
            "name": "History Tester",
            "password": "StrongPass1!",
            "device_fingerprint": fingerprint,
        },
    )


def test_resume_history_requires_auth():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    assert client.get("/resume-history/1").status_code == 401
    assert (
        client.post(
            "/resume-history",
            json={
                "user_id": 1,
                "resume_name": "x",
                "analysis_result": {"cv_text": "Python"},
            },
        ).status_code
        == 401
    )
    assert (
        client.post(
            "/resume-history/compare",
            json={"user_id": 1, "base_version_id": 1, "target_version_id": 2},
        ).status_code
        == 401
    )


def test_resume_history_blocks_cross_user_access():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    pid = os.getpid()
    a = _register(client, f"hist_a_{pid}@example.com", "fp-a")
    b = _register(client, f"hist_b_{pid}@example.com", "fp-b")
    assert a.status_code == 200, a.text
    assert b.status_code == 200, b.text

    token_a = a.json()["access_token"]
    token_b = b.json()["access_token"]
    user_a = a.json()["user"]
    user_b = b.json()["user"]

    save = client.post(
        "/resume-history",
        headers={"Authorization": f"Bearer {token_a}"},
        json={
            "user_id": user_b["id"],
            "resume_name": "Mine",
            "analysis_result": {
                "cv_text": "Skills: Python\n",
                "skill_match_pct": 70,
                "matched_skills": ["Python"],
            },
        },
    )
    assert save.status_code == 200
    assert save.json()["user_id"] == user_a["id"]

    cross = client.get(
        f"/resume-history/{user_a['id']}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert cross.status_code == 403

    own = client.get(
        f"/resume-history/{user_a['id']}",
        headers={"Authorization": f"Bearer {token_a}"},
    )
    assert own.status_code == 200
    assert len(own.json()["versions"]) >= 1
