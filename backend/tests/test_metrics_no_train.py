"""Ensure /metrics never triggers model training."""

import os
import sys
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_metrics_does_not_train_when_unloaded():
    try:
        from fastapi.testclient import TestClient
        from main import app, model_manager
    except ImportError as e:
        print(f"[CI-SKIP] Heavy deps not in CI env: {e}")
        return

    client = TestClient(app)
    original = model_manager.metrics
    try:
        model_manager.metrics = {}
        with (
            patch.object(model_manager, "load_models", return_value=False) as load_mock,
            patch.object(model_manager, "train_models") as train_mock,
        ):
            response = client.get("/metrics")
            assert response.status_code == 503
            load_mock.assert_called()
            train_mock.assert_not_called()
    finally:
        model_manager.metrics = original
