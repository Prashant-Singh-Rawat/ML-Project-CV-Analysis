# ruff: noqa: E402
import sys
from unittest.mock import MagicMock

import numpy as np

# Mock third-party dependencies to allow importing modules without them installed
for module_name in [
    "spacy",
    "pdfplumber",
    "fpdf",
    "passlib",
    "passlib.context",
    "jose",
    "jose.jwt",
    "pythonjsonlogger",
]:
    try:
        __import__(module_name)
    except ImportError:
        sys.modules[module_name] = MagicMock()

# Always mock sentence-transformers to avoid downloading heavy models in unit tests
sys.modules["sentence_transformers"] = MagicMock()
mock_util = MagicMock()
sys.modules["sentence_transformers"].util = mock_util

from ml_pipeline import semantic_matcher
from ml_pipeline.semantic_matcher import semantic_skill_match


# Helper classes for matrix representation without torch
class RowMock:
    def __init__(self, scores_array):
        self.scores = np.array(scores_array, dtype=np.float32)

    def cpu(self):
        return self

    def numpy(self):
        return self.scores


class MatrixMock:
    def __init__(self, matrix):
        self.matrix = [RowMock(row) for row in matrix]

    def __getitem__(self, idx):
        return self.matrix[idx]


SIMILARITY_MAP = {
    ("backend development", "built scalable backend apis using fastapi"): 0.85,
    ("backend engineering", "developed python microservices"): 0.90,
    (
        "machine learning",
        "developed predictive models using python and scikit-learn",
    ): 0.88,
    ("database administration", "designed responsive ui using react"): 0.15,
}


def get_similarity(req, cand):
    req_l = req.lower().strip()
    cand_l = cand.lower().strip()
    if req_l == cand_l:
        return 1.0
    return SIMILARITY_MAP.get((req_l, cand_l), 0.1)


def mock_cos_sim(req_emb, cand_emb):
    matrix = []
    for req in req_emb:
        row = []
        for cand in cand_emb:
            row.append(get_similarity(req, cand))
        matrix.append(row)
    return MatrixMock(matrix)


# Configure the mock utils
mock_util.cos_sim.side_effect = mock_cos_sim


def setup_mock_model():
    model_mock = MagicMock()
    model_mock.encode.side_effect = lambda x, **kwargs: x
    semantic_matcher._model = model_mock
    semantic_matcher._model_ok = True


def test_exact_skill_matches():
    setup_mock_model()

    candidate = ["Python", "React"]
    required = ["Python", "SQL"]

    result = semantic_skill_match(candidate, required)
    assert result["engine"] == "bert"
    assert "Python" in result["matched_skills"]
    assert "SQL" in result["missing_skills"]
    assert result["skill_match_pct"] == 50.0


def test_semantically_similar_skills():
    setup_mock_model()

    candidate = ["Built scalable backend APIs using FastAPI"]
    required = ["Backend Development"]

    result = semantic_skill_match(candidate, required, similarity_threshold=0.55)
    assert result["engine"] == "bert"
    assert "Backend Development" in result["matched_skills"]
    assert result["skill_match_pct"] == 100.0


def test_clearly_unrelated_skills():
    setup_mock_model()

    candidate = ["Designed responsive UI using React"]
    required = ["Database Administration"]

    result = semantic_skill_match(candidate, required, similarity_threshold=0.55)
    assert result["engine"] == "bert"
    assert "Database Administration" in result["missing_skills"]
    assert result["skill_match_pct"] == 0.0


def test_empty_candidate_skills():
    setup_mock_model()

    result = semantic_skill_match([], ["Python"])
    assert result["skill_match_pct"] == 0.0
    assert result["missing_skills"] == ["Python"]


def test_empty_required_skills():
    setup_mock_model()

    result = semantic_skill_match(["Python"], [])
    assert result["skill_match_pct"] == 75.0
    assert result["matched_skills"] == []


def test_duplicate_skills_handling():
    setup_mock_model()

    # Duplicate required and candidate skills
    candidate = ["Python", "Python", "React"]
    required = ["Python", "SQL", "SQL"]

    result = semantic_skill_match(candidate, required)
    assert result["engine"] == "bert"
    assert "Python" in result["matched_skills"]
    assert "SQL" in result["missing_skills"]
    # Handled as unique "Python" and "SQL" -> 50% match
    assert result["skill_match_pct"] == 50.0


def test_model_load_failure_fallback():
    # Force _get_model to fail (return None)
    semantic_matcher._model = None
    semantic_matcher._model_ok = False

    result = semantic_skill_match(["Python"], ["Python", "SQL"])
    assert result["engine"] == "keyword"
    assert result["skill_match_pct"] == 50.0


def test_model_inference_failure_fallback():
    setup_mock_model()

    # Force encode to raise an exception
    semantic_matcher._model.encode.side_effect = RuntimeError("Inference error")

    result = semantic_skill_match(["Python"], ["Python", "SQL"])
    assert result["engine"] == "keyword"
    assert result["skill_match_pct"] == 50.0


def test_final_candidate_matching_influenced():
    # Verify that compute_hiring_analysis is influenced by semantic matching
    from main import compute_hiring_analysis

    setup_mock_model()

    # candidate has "Developed predictive models using Python and scikit-learn"
    # for "Data Scientist" job category which has "Machine Learning" required
    # Without semantic match, it would not match. With semantic match, it should.

    candidate = [
        "Developed predictive models using Python and scikit-learn",
        "Python",
        "SQL",
    ]

    # Let's compute hiring analysis
    res = compute_hiring_analysis(candidate, 8.0, "experienced")

    # Let's find "Data Scientist" or "ML Engineer" role
    data_scientist_role = next(
        r for r in res["job_analysis"] if r["role"] == "Data Scientist"
    )

    # "Machine Learning" is a required skill for Data Scientist
    # Let's assert it is in matched_skills
    assert "Machine Learning" in data_scientist_role["matched_skills"]
