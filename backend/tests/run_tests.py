import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

import test_semantic_matcher

tests = [
    test_semantic_matcher.test_exact_skill_matches,
    test_semantic_matcher.test_semantically_similar_skills,
    test_semantic_matcher.test_clearly_unrelated_skills,
    test_semantic_matcher.test_empty_candidate_skills,
    test_semantic_matcher.test_empty_required_skills,
    test_semantic_matcher.test_duplicate_skills_handling,
    test_semantic_matcher.test_model_load_failure_fallback,
    test_semantic_matcher.test_model_inference_failure_fallback,
    test_semantic_matcher.test_final_candidate_matching_influenced,
]

failed = 0
for test in tests:
    try:
        # Reset matcher globals before each test to ensure clean state
        test_semantic_matcher.semantic_matcher._model = None
        test_semantic_matcher.semantic_matcher._model_ok = None

        test()
        print(f"PASS: {test.__name__}")
    except Exception as e:
        print(f"FAIL: {test.__name__} - {e}")
        import traceback

        traceback.print_exc()
        failed += 1

if failed > 0:
    print(f"\n{failed} tests failed.")
    sys.exit(1)
else:
    print("\nAll tests passed successfully!")
    sys.exit(0)
