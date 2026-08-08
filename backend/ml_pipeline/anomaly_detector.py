import logging
import numpy as np
from sklearn.ensemble import IsolationForest

logger = logging.getLogger(__name__)

class WorkHistoryAnomalyDetector:
    """
    Uses Isolation Forests to flag inconsistencies and exaggerated claims 
    in a candidate's work history (e.g., Senior VP role with 1 year of experience).
    """
    
    def __init__(self):
        self.model = IsolationForest(contamination=0.05, random_state=42)
        self._is_fitted = False
        self._fit_synthetic_baseline()

    def _fit_synthetic_baseline(self):
        """
        Fits the Isolation Forest on a synthetic baseline of 'normal' career progressions.
        Features: [Years of Experience, Seniority Score (1-10)]
        """
        # Generate synthetic 'normal' data (linear progression roughly)
        np.random.seed(42)
        years = np.random.uniform(0, 20, 1000)
        # Normal progression: Seniority roughly equals (years / 2) + noise
        seniority = (years / 2.0) + np.random.normal(0, 1, 1000)
        seniority = np.clip(seniority, 1, 10)
        
        X = np.column_stack((years, seniority))
        self.model.fit(X)
        self._is_fitted = True

    def detect_anomalies(self, years_experience: float, seniority_score: float) -> dict:
        """
        Evaluates a candidate's profile for exaggerated claims.
        """
        if not self._is_fitted:
            return {"is_anomalous": False, "risk_score": 0.0, "flags": []}
            
        # Ensure bounds
        seniority_score = max(1.0, min(10.0, float(seniority_score)))
        years_experience = max(0.0, float(years_experience))
        
        X_test = np.array([[years_experience, seniority_score]])
        prediction = self.model.predict(X_test)[0]
        decision_score = float(self.model.decision_function(X_test)[0])
        
        # Convert decision score to a 0-100 risk score (lower decision score = higher risk)
        # Normalization is approximate for this mock
        risk_score = round(max(0, min(100, (-decision_score + 0.1) * 200)), 1)
        
        is_anomalous = prediction == -1
        flags = []
        
        if is_anomalous:
            if years_experience < 3 and seniority_score > 7:
                flags.append("High seniority claimed with very low years of experience.")
            elif years_experience > 15 and seniority_score < 3:
                flags.append("Extended experience with unusually low seniority progression.")
            else:
                flags.append("Unusual career trajectory detected compared to baseline.")

        return {
            "is_anomalous": bool(is_anomalous),
            "risk_score": risk_score,
            "flags": flags
        }

# Singleton instance
_anomaly_detector = None

def get_anomaly_detector():
    global _anomaly_detector
    if _anomaly_detector is None:
        _anomaly_detector = WorkHistoryAnomalyDetector()
    return _anomaly_detector
