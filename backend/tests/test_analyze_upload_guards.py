"""Upload guard tests for POST /analyze."""

import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_analyze_rejects_missing_filename():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    response = client.post(
        "/analyze",
        files={"cv_file": ("", io.BytesIO(b"%PDF-1.4"), "application/pdf")},
        data={"cgpa": "8.0", "target_company": "Google", "experience_level": "fresher"},
    )
    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_analyze_rejects_oversized_upload():
    try:
        from fastapi.testclient import TestClient
        from main import app
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    huge = b"%PDF-1.4\n" + (b"x" * (10 * 1024 * 1024 + 100))
    response = client.post(
        "/analyze",
        files={"cv_file": ("big.pdf", io.BytesIO(huge), "application/pdf")},
        data={"cgpa": "8.0", "target_company": "Google", "experience_level": "fresher"},
    )
    assert response.status_code == 413
