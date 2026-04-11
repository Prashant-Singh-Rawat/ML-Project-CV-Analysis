import os
import random
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from ml_pipeline.synthetic_data import COMPANY_REQUIREMENTS, generate_synthetic_data, COMPANIES

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
        if os.path.exists(self.model_path) and os.path.exists(self.metrics_path) and os.path.exists(self.features_path):
            self.model = joblib.load(self.model_path)
            self.metrics = joblib.load(self.metrics_path)
            self.feature_names = joblib.load(self.features_path)
            return True
        return False

    def train_models(self):
        print("Training real ML model (RandomForest)...")
        # 1. Generate or load data
        df = generate_synthetic_data(10000)
        
        # 2. Preprocessing
        # We'll use CGPA and SkillMatchPct as numerical features
        # We'll encode TargetCompany as categorical features
        df_encoded = pd.get_dummies(df, columns=['TargetCompany'])
        
        # Define features and target
        X = df_encoded.drop(['PlacementProbability', 'PlacementStatus', 'Skills'], axis=1)
        y = df['PlacementStatus']
        self.feature_names = X.columns.tolist()
        
        # 3. Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # 4. Train RandomForest
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # 5. Evaluate
        y_pred = self.model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, output_dict=True)
        
        # Store metrics (taking weighted averages for overall metrics)
        self.metrics = {
            "accuracy": round(acc, 4),
            "precision": round(report['weighted avg']['precision'], 4),
            "recall": round(report['weighted avg']['recall'], 4),
            "f1_score": round(report['weighted avg']['f1-score'], 4)
        }
        
        # 6. Save model and metrics
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.metrics, self.metrics_path)
        joblib.dump(self.feature_names, self.features_path)
        print(f"Model trained with accuracy: {acc}")
        return True


    def predict(self, candidate_cgpa, target_company, candidate_skills):
        if self.model is None:
            self.load_models() or self.train_models()

        # 1. Calculate Skill Match (Feature Engineering)
        req_skills = COMPANY_REQUIREMENTS.get(target_company, {}).get("required_skills", [])
        if not req_skills:
            skill_match_pct = 75.0
            matched = []
        else:
            matched = set(candidate_skills).intersection(req_skills)
            skill_match_pct = (len(matched) / len(req_skills)) * 100

        # 2. Prepare Features for Model
        feature_data = {
            "CGPA": candidate_cgpa,
            "SkillMatchPct": skill_match_pct
        }
        # Explicitly set all company dummies
        for company in COMPANIES:
            feature_data[f"TargetCompany_{company}"] = 1 if company == target_company else 0
            
        X_input = pd.DataFrame([feature_data])
        
        # Ensure correct column order and handle any missing columns from encoding
        if self.feature_names:
            for col in self.feature_names:
                if col not in X_input.columns:
                    X_input[col] = 0
            X_input = X_input[self.feature_names]
        
        # 3. Model Prediction
        try:
            placement_status = self.model.predict(X_input)[0]
            probs = self.model.predict_proba(X_input)[0]
            
            # Map probabilities to classes
            class_probs = dict(zip(self.model.classes_, probs))
            
            high_prob = class_probs.get("High Chance", 0)
            med_prob = class_probs.get("Medium Chance", 0)
            low_prob = class_probs.get("Low Chance", 0)
            
            # Weighted probability for aesthetic display
            display_prob = (high_prob * 90) + (med_prob * 60) + (low_prob * 25)
            
        except Exception as e:
            print(f"Prediction error: {e}")
            # Fallback based on simple logic if model fails
            placement_status = "High Chance" if skill_match_pct > 80 and candidate_cgpa > 8 else "Medium Chance"
            display_prob = skill_match_pct * 0.7 + candidate_cgpa * 3

        return {
            "placement_probability": round(display_prob, 2),
            "placement_status": placement_status,
            "skill_match_pct": round(skill_match_pct, 2),
            "matched_skills": list(matched),
            "missing_skills": list(set(req_skills) - set(candidate_skills))
        }


if __name__ == "__main__":
    manager = ModelManager()
    print(manager.predict(8.0, "Google", ["Python", "C++"]))
