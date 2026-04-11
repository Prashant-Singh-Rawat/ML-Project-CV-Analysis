import pandas as pd
import numpy as np
import random
import os

# Define some domain knowledge parameters for the synthetic dataset
SKILLS_DB = [
    "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin", "TypeScript", "JavaScript",
    "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Spring Boot",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Scikit-Learn",
    "Data Analysis", "Pandas", "NumPy", "Matplotlib", "Tableau", "Power BI",
    "Agile", "Scrum", "Git", "GitHub", "Jira", "Communication", "Leadership", "Problem Solving", "Teamwork"
]

COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix", "Infosys", "TCS", "Oracle", "IBM", "Adobe"]

# Company requirements thresholds
COMPANY_REQUIREMENTS = {
    "Google": {"min_cgpa": 8.5, "required_skills": ["Python", "C++", "Machine Learning", "Data Analysis", "Algorithms"]},
    "Amazon": {"min_cgpa": 8.0, "required_skills": ["Java", "AWS", "SQL", "Leadership", "Scalability"]},
    "Microsoft": {"min_cgpa": 8.0, "required_skills": ["C++", "C#", "Azure", "Cloud", "Software Design"]},
    "Meta": {"min_cgpa": 8.2, "required_skills": ["JavaScript", "React", "Node.js", "Python", "Social Media Tech"]},
    "Apple": {"min_cgpa": 8.5, "required_skills": ["Swift", "C++", "Objective-C", "Communication", "Quality Assurance"]},
    "Netflix": {"min_cgpa": 8.0, "required_skills": ["Python", "AWS", "Machine Learning", "Microservices", "Java"]},
    "Infosys": {"min_cgpa": 6.5, "required_skills": ["Java", "SQL", "Communication", "Web Development"]},
    "TCS": {"min_cgpa": 6.5, "required_skills": ["Java", "JavaScript", "SQL", "Enterprise Solutions"]},
    "Oracle": {"min_cgpa": 7.5, "required_skills": ["Java", "SQL", "Database Design", "Cloud Architecture"]},
    "IBM": {"min_cgpa": 7.0, "required_skills": ["Python", "AI", "Cloud", "Data Science"]},
    "Adobe": {"min_cgpa": 8.0, "required_skills": ["C++", "Java", "Graphics", "UI/UX"]}
}

def generate_synthetic_data(num_samples=10000):
    data = []
    
    for _ in range(num_samples):
        company = random.choice(COMPANIES)
        cgpa = round(np.random.normal(7.5, 1.2), 1)
        cgpa = max(5.0, min(10.0, cgpa)) # bound between 5.0 and 10.0
        
        # Decide if this candidate is good (for balance)
        is_good_candidate = random.random() > 0.5
        
        if is_good_candidate:
            num_skills = random.randint(5, 12)
            # Give them a high chance of having the required skills
            target_skills = set(COMPANY_REQUIREMENTS.get(company, {}).get("required_skills", []))
            candidate_skills = list(target_skills) + random.sample(SKILLS_DB, max(0, num_skills - len(target_skills)))
        else:
            num_skills = random.randint(2, 6)
            candidate_skills = random.sample(SKILLS_DB, num_skills)
            target_skills = [] # mostly irrelevant skills
            
        candidate_skills = list(set(candidate_skills))
        
        # Calculate derived feature: Skill Match Score (0 to 100)
        req_skills = COMPANY_REQUIREMENTS.get(company, {}).get("required_skills", [])
        if not req_skills:
            skill_match_pct = random.uniform(50, 100)
        else:
            matched = set(candidate_skills).intersection(req_skills)
            skill_match_pct = (len(matched) / len(req_skills)) * 100
        
        # Calculate Placement Probability Rules
        probability = 0
        min_cgpa = COMPANY_REQUIREMENTS.get(company, {}).get("min_cgpa", 7.0)
        
        if cgpa < (min_cgpa - 0.5):
            probability = random.uniform(5, 30) # Too low CGPA
        elif cgpa >= min_cgpa and skill_match_pct >= 75:
            probability = random.uniform(80, 99) # Excelent
        elif cgpa >= min_cgpa and skill_match_pct >= 50:
            probability = random.uniform(50, 79) # Marginal
        else:
            probability = random.uniform(20, 50)
            
        # Introduce some noise
        probability += random.uniform(-10, 10)
        probability = max(0, min(100, probability))
        
        # Determine classification
        if probability >= 75:
            placement_status = "High Chance"
        elif probability >= 45:
            placement_status = "Medium Chance"
        else:
            placement_status = "Low Chance"
            
        data.append({
            "CGPA": cgpa,
            "TargetCompany": company,
            "Skills": ", ".join(candidate_skills),
            "SkillMatchPct": round(skill_match_pct, 2),
            "PlacementProbability": round(probability, 2),
            "PlacementStatus": placement_status
        })
        
    df = pd.DataFrame(data)
    
    # Save to a CSV for caching and auditing
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "synthetic_cv_dataset.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated {num_samples} records and saved to {csv_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_data(5000)
