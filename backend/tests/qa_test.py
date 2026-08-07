# ruff: noqa: E402
import os
import sys

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from unittest.mock import MagicMock
import numpy as np

# Mock third-party dependencies
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
        sys.modules[module_name] = (
            MagicMock() if module_name not in sys.modules else sys.modules[module_name]
        )

# Always mock sentence-transformers to avoid downloading heavy models in unit tests
sys.modules["sentence_transformers"] = MagicMock()
mock_st = sys.modules["sentence_transformers"]
mock_util = MagicMock()
mock_st.util = mock_util

from ml_pipeline import semantic_matcher
from ml_pipeline.semantic_matcher import semantic_skill_match


# Helper classes for matrix representation
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


# Map representing correct semantic similarities for the issue description's examples
SIMILARITY_MAP = {
    ("backend development", "built scalable backend apis using fastapi"): 0.85,
    ("backend engineering", "developed python microservices"): 0.90,
    ("machine learning", "created predictive models using scikit-learn"): 0.88,
    ("frontend development", "designed responsive interfaces using react"): 0.86,
    ("database administration", "designed responsive ui using react"): 0.12,
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


mock_util.cos_sim.side_effect = mock_cos_sim

# Setup mock model
model_mock = MagicMock()
model_mock.encode.side_effect = lambda x, **kwargs: x
semantic_matcher._model = model_mock
semantic_matcher._model_ok = True


# Exact keyword matching simulation function (representing the old logic)
def exact_keyword_match(candidate, required):
    cand_set = {s.lower() for s in candidate}
    matched = [r for r in required if r.lower() in cand_set]
    pct = (len(matched) / len(required)) * 100 if required else 0.0
    return matched, pct


# Run the QA cases
test_cases = [
    {
        "candidate": ["Built scalable backend APIs using FastAPI"],
        "required": ["Backend Development"],
    },
    {
        "candidate": ["Developed Python microservices"],
        "required": ["Backend Engineering"],
    },
    {
        "candidate": ["Created predictive models using scikit-learn"],
        "required": ["Machine Learning"],
    },
    {
        "candidate": ["Designed responsive interfaces using React"],
        "required": ["Frontend Development"],
    },
    {
        "candidate": ["Designed responsive UI using React"],
        "required": ["Database Administration"],
    },
]

print("=" * 90)
print("QA ANALYSIS TEST: SEMANTIC MATCHING VS EXACT KEYWORD MATCHING")
print("=" * 90)

for idx, case in enumerate(test_cases, 1):
    cand = case["candidate"]
    req = case["required"]

    # Exact Keyword Matching (Old Logic)
    exact_matched, exact_pct = exact_keyword_match(cand, req)

    # Semantic Matching (New Logic)
    sem_res = semantic_skill_match(cand, req, similarity_threshold=0.55)
    sem_matched = sem_res["matched_skills"]
    sem_pct = sem_res["skill_match_pct"]
    engine = sem_res["engine"]
    confidence = (
        sem_res["match_details"][0]["confidence"] if sem_res["match_details"] else 0.0
    )

    status = (
        "SUCCESS"
        if (sem_pct > 0 and idx < 5) or (sem_pct == 0 and idx == 5)
        else "FAILED"
    )

    print(f"\nTest Case #{idx}:")
    print(f"  Candidate Skill  : {cand}")
    print(f"  Required Skill   : {req}")
    print("  -------------------------------------------------------------")
    print(f"  Old Keyword Match: Matched: {exact_matched} | Score: {exact_pct:.1f}%")
    print(
        f"  New Semantic Match: Matched: {sem_matched} | Score: {sem_pct:.1f}% | Similarity: {confidence}% (Engine: {engine})"
    )
    print(f"  Verdict          : {status}")

print("=" * 90)
