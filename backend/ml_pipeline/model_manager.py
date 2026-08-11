import os
import logging
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from ml_pipeline.synthetic_data import (
    COMPANY_REQUIREMENTS,
    generate_synthetic_data,
    COMPANIES,
)

# ── BERT Semantic Matcher ───────────────────────────────────────────────────
# Import lazily — the model only loads into RAM when first needed
from ml_pipeline.semantic_matcher import semantic_skill_match

# ── Logging and model path ──────────────────────────────────────────────────
logger = logging.getLogger(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
METRICS_PATH = os.path.join(BASE_DIR, "metrics.joblib")
FEATURES_PATH = os.path.join(BASE_DIR, "features.joblib")


def _train_and_save():
    """
    Train the RandomForestClassifier from synthetic data and persist
    the model, metrics, and feature names.
    """
    logger.info("model.pkl not found — training from synthetic_data.py ...")
    df = generate_synthetic_data(10000)

    # Encode and prepare features
    df_encoded = pd.get_dummies(df, columns=["TargetCompany"])
    X = df_encoded.drop(
        ["PlacementProbability", "PlacementStatus", "Skills"], axis=1
    )
    y = df["PlacementStatus"]
    feature_names = X.columns.tolist()

    # Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(report["weighted avg"]["precision"], 4),
        "recall": round(report["weighted avg"]["recall"], 4),
        "f1_score": round(report["weighted avg"]["f1-score"], 4),
    }

    # Persist all artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(metrics, METRICS_PATH)
    joblib.dump(feature_names, FEATURES_PATH)

    logger.info("Model trained and saved to %s", MODEL_PATH)
    return model


def load_model():
    """Return the trained model, auto‑training it if missing."""
    if not os.path.exists(MODEL_PATH):
        return _train_and_save()
    return joblib.load(MODEL_PATH)


class ModelManager:
    def __init__(self):
        self.model = None
        self.metrics = None
        self.feature_names = None
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(self.base_path, "model.pkl")
        self.metrics_path = os.path.join(self.base_path, "metrics.joblib")
        self.features_path = os.path.join(self.base_path, "features.joblib")

    def load_models(self):
        """Load all artifacts, auto‑training if model is missing."""
        self.model = load_model()  # ensures model exists
        if os.path.exists(self.metrics_path):
            self.metrics = joblib.load(self.metrics_path)
        else:
            self.metrics = None
        if os.path.exists(self.features_path):
            self.feature_names = joblib.load(self.features_path)
        else:
            self.feature_names = None
        return True

    def train_models(self):
        """(Re)train and persist the model, metrics, and feature names."""
        _train_and_save()
        # Reload the freshly saved artifacts
        self.model = joblib.load(self.model_path)
        self.metrics = joblib.load(self.metrics_path)
        self.feature_names = joblib.load(self.features_path)
        print(f"Model trained with accuracy: {self.metrics['accuracy']}")
        return True

    def predict(self, candidate_cgpa, target_company, candidate_skills):
        if self.model is None:
            self.load_models()  # will auto‑train if needed

        req_skills = COMPANY_REQUIREMENTS.get(target_company, {}).get(
            "required_skills", []
        )

        # ── BERT Semantic Skill Matching ──────────────────────────────────────
        if req_skills and candidate_skills:
            bert_result = semantic_skill_match(
                candidate_skills, req_skills, similarity_threshold=0.55
            )
            matched = bert_result["matched_skills"]
            missing = bert_result["missing_skills"]
            skill_match_pct = bert_result["skill_match_pct"]
            match_details = bert_result["match_details"]
        else:
            matched = []
            missing = req_skills if req_skills else []
            skill_match_pct = 75.0 if not req_skills else 0.0
            match_details = []

        # ── RandomForest Prediction ───────────────────────────────────────────
        feature_data = {"CGPA": candidate_cgpa, "SkillMatchPct": skill_match_pct}
        for company in COMPANIES:
            feature_data[f"TargetCompany_{company}"] = (
                1 if company == target_company else 0
            )

        X_input = pd.DataFrame([feature_data])
        if self.feature_names:
            for col in self.feature_names:
                if col not in X_input.columns:
                    X_input[col] = 0
            X_input = X_input[self.feature_names]

        try:
            placement_status = self.model.predict(X_input)[0]
            probs = self.model.predict_proba(X_input)[0]
            class_probs = dict(zip(self.model.classes_, probs))
            high_prob = class_probs.get("High Chance", 0)
            med_prob = class_probs.get("Medium Chance", 0)
            low_prob = class_probs.get("Low Chance", 0)
            display_prob = (high_prob * 90) + (med_prob * 60) + (low_prob * 25)
        except Exception as e:
            print(f"Prediction error: {e}")
            placement_status = (
                "High Chance"
                if skill_match_pct > 80 and candidate_cgpa > 8
                else "Medium Chance"
            )
            display_prob = skill_match_pct * 0.7 + candidate_cgpa * 3

        return {
            "placement_probability": round(display_prob, 2),
            "placement_status": placement_status,
            "skill_match_pct": round(skill_match_pct, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "match_details": match_details,
        }


if __name__ == "__main__":
    manager = ModelManager()
    result = manager.predict(
        8.0, "Google", ["neural networks", "Python", "built REST APIs"]
    )
    print(result)