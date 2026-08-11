import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class CareerTrajectoryModel:
    """
    Simulates an LSTM/Transformer sequence model to forecast a candidate's next 
    career move based on their historical job trajectory.
    """
    
    def __init__(self):
        # In production, this would load a pre-trained PyTorch/TensorFlow sequence model.
        # e.g., self.model = torch.load('lstm_career_path.pt')
        self._is_loaded = True
        
        # A lightweight transition matrix simulating typical tech career progressions
        self.transitions = {
            "junior developer": "software engineer",
            "software engineer": "senior software engineer",
            "senior software engineer": "lead engineer",
            "lead engineer": "engineering manager",
            "engineering manager": "director of engineering",
            "data analyst": "data scientist",
            "data scientist": "senior data scientist",
            "senior data scientist": "machine learning engineer",
            "machine learning engineer": "ai researcher"
        }

    def predict_next_role(self, historical_roles: List[str]) -> Dict[str, Any]:
        """
        Predicts the next likely role and assesses trajectory momentum.
        historical_roles should be ordered from oldest to newest.
        """
        if not historical_roles:
            return {
                "next_likely_role": "Unknown",
                "trajectory": "Stagnant",
                "confidence": 0.0,
                "insights": "Not enough role history provided."
            }

        latest_role = historical_roles[-1].lower().strip()
        
        # Find next logical step in transition matrix
        next_role = self.transitions.get(latest_role, None)
        
        # Calculate momentum based on number of unique roles (simulating rapid promotion)
        unique_roles = len(set(r.lower() for r in historical_roles))
        total_roles = len(historical_roles)
        
        if unique_roles >= 3 and total_roles <= 5:
            momentum = "Rapid Promotion"
        elif unique_roles == 1 and total_roles >= 3:
            momentum = "Stagnant"
        else:
            momentum = "Steady Progression"

        if next_role:
            confidence = 85.5
            insight = f"Candidate is well-positioned for a {next_role.title()} role based on historical patterns."
        else:
            # Fallback for unknown sequences
            next_role = f"Senior {latest_role.title()}" if "senior" not in latest_role else f"Lead {latest_role.title().replace('Senior ', '')}"
            confidence = 60.0
            insight = f"Assuming typical linear progression to {next_role}."

        return {
            "next_likely_role": next_role.title(),
            "trajectory": momentum,
            "confidence": confidence,
            "insights": insight
        }

# Singleton instance
_trajectory_model = None

def get_trajectory_model():
    global _trajectory_model
    if _trajectory_model is None:
        _trajectory_model = CareerTrajectoryModel()
    return _trajectory_model
