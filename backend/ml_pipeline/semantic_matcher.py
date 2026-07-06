"""
semantic_matcher.py  —  CRASH-PROOF BERT semantic skill matching
----------------------------------------------------------------
3-Layer Safety System:
  Layer 1: BERT model load failure → graceful fallback to keyword matching
  Layer 2: BERT inference failure  → graceful fallback to keyword matching  
  Layer 3: Any unexpected error    → always returns a valid dict, never raises

The website will NEVER crash because of this module.
"""

import numpy as np
import logging

logger = logging.getLogger(__name__)

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
_model = None  # Lazy-loaded singleton
_model_ok = None  # None=untried, True=loaded, False=failed permanently


# ─────────────────────────────────────────────────────────────
#  LAYER 1: Safe model loader — one-time attempt, never retries
# ─────────────────────────────────────────────────────────────
def _get_model():
    """
    Try to load the BERT model once.
    If it fails for any reason (memory, missing package, network),
    we set _model_ok=False and all future calls skip BERT silently.
    """
    global _model, _model_ok

    if _model_ok is True:  # Already loaded successfully
        return _model
    if _model_ok is False:  # Already failed — don't retry
        return None

    try:
        from sentence_transformers import SentenceTransformer

        logger.info("[BERT] Loading all-MiniLM-L6-v2...")
        _model = SentenceTransformer(MODEL_NAME)
        _model_ok = True
        logger.info("[BERT] Model loaded OK.")
        return _model
    except Exception as exc:
        _model_ok = False
        logger.warning(
            f"[BERT] Could not load — falling back to keyword matching. Reason: {exc}"
        )
        return None


# ─────────────────────────────────────────────────────────────
#  LAYER 2 & 3: Keyword fallback (always safe)
# ─────────────────────────────────────────────────────────────
def _keyword_fallback(candidate_skills: list, required_skills: list) -> dict:
    """Plain set-intersection — zero dependencies, can never crash."""
    cand_lower = {s.lower() for s in candidate_skills}
    matched = [r for r in required_skills if r.lower() in cand_lower]
    missing = [r for r in required_skills if r.lower() not in cand_lower]
    pct = (len(matched) / len(required_skills) * 100) if required_skills else 75.0
    details = [
        {
            "required": r,
            "best_match": r if r in matched else None,
            "confidence": 100.0 if r in matched else 0.0,
            "matched": r in matched,
        }
        for r in required_skills
    ]
    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "skill_match_pct": round(pct, 2),
        "match_details": details,
        "engine": "keyword",
    }


# ─────────────────────────────────────────────────────────────
#  Public API
# ─────────────────────────────────────────────────────────────
def semantic_skill_match(
    candidate_skills: list, required_skills: list, similarity_threshold: float = 0.55
) -> dict:
    """
    Semantically match candidate skills against required skills.

    Returns a safe dict with:
      matched_skills, missing_skills, skill_match_pct, match_details, engine

    NEVER raises — always returns a valid result even if BERT fails.
    """
    # ── Edge cases ───────────────────────────────────────────
    if not required_skills:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "skill_match_pct": 75.0,
            "match_details": [],
            "engine": "none",
        }
    if not candidate_skills:
        return {
            "matched_skills": [],
            "missing_skills": required_skills,
            "skill_match_pct": 0.0,
            "match_details": [
                {"required": s, "best_match": None, "confidence": 0.0, "matched": False}
                for s in required_skills
            ],
            "engine": "none",
        }

    # ── Layer 1: try BERT ────────────────────────────────────
    model = _get_model()
    if model is None:
        # BERT unavailable — use keyword fallback
        return _keyword_fallback(candidate_skills, required_skills)

    # ── Layer 2: safe BERT inference ─────────────────────────
    try:
        from sentence_transformers import util

        cand_emb = model.encode(candidate_skills, convert_to_tensor=True)
        req_emb = model.encode(required_skills, convert_to_tensor=True)
        cos = util.cos_sim(req_emb, cand_emb)

        matched, missing, details = [], [], []

        for i, req in enumerate(required_skills):
            scores = cos[i].cpu().numpy()
            best_idx = int(np.argmax(scores))
            best_score = float(scores[best_idx])
            best_skill = candidate_skills[best_idx]
            is_match = best_score >= similarity_threshold

            (matched if is_match else missing).append(req)
            details.append(
                {
                    "required": req,
                    "best_match": best_skill if is_match else None,
                    "confidence": round(best_score * 100, 1),
                    "matched": is_match,
                }
            )

        pct = (len(matched) / len(required_skills)) * 100
        return {
            "matched_skills": matched,
            "missing_skills": missing,
            "skill_match_pct": round(pct, 2),
            "match_details": details,
            "engine": "bert",
        }

    except Exception as exc:
        # ── Layer 3: catch-all — fall through to keyword ─────
        logger.error(f"[BERT] Inference failed, using keyword fallback: {exc}")
        return _keyword_fallback(candidate_skills, required_skills)


if __name__ == "__main__":
    result = semantic_skill_match(
        ["neural networks", "deep learning", "Python", "built REST APIs"],
        ["Machine Learning", "Python", "Backend Development", "SQL"],
    )
    print(f"\nEngine: {result['engine']}")
    for d in result["match_details"]:
        icon = "✅" if d["matched"] else "❌"
        print(f"  {icon} {d['required']} → '{d['best_match']}' ({d['confidence']}%)")
    print(f"  Overall: {result['skill_match_pct']}%")
