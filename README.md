# 🚀 TonyCV – AI-Powered CV Analyzer & Resume Optimizer

**TonyCV** is an end-to-end recruitment intelligence platform designed to bridge the gap between candidates and recruiters. Leveraging state-of-the-art NLP, Machine Learning, and Interactive Visualizations, it provides a 360-degree analysis of resumes, predicting placement success and offering actionable career roadmaps.

---

## ✨ Key Features

- **🧠 Intelligent CV Parsing**: Automated extraction of skills, organizations, and entities from PDF resumes using custom NLP pipelines.
- **📈 Predictive Placement Analytics**: Get a data-driven probability score for landing a job at specific "Big Tech" companies (Google, Microsoft, Amazon, etc.).
- **🔥 Skill-Gap Heatmap**: Interactive visual highlighting of exactly which keywords your resume contains and what's missing for your target role.
- **🎤 Biometric Interview Simulation**: An AI-driven interview practice module with biometric marker tracking for professional growth.
- **🌳 Dynamic Career Roadmap**: A visual tree-based progression plan showing you exactly how to reach your ultimate career goals.
- **💻 GitHub Code Audit**: Automated (simulated) scan of your GitHub repositories to detect code quality and security vulnerabilities.
- **🌍 Market Pulse**: Live tracking of trending vs. declining industry skills to keep your profile future-proof.
- **📄 Professional PDF Export**: Generate and download comprehensive analysis reports and career roadmaps in one click.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Charts/Graphs**: Chart.js & React-Chartjs-2
- **Icons**: React Icons (Lucide/Fa)
- **Export**: html2pdf.js

### **Backend**
- **Framework**: FastAPI (Python 3.9+)
- **WebServer**: Uvicorn
- **Parsing**: Custom PDF & NLP Utils
- **ML Engine**: Scikit-Learn (RandomForest/GradientBoosting)

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- Python (v3.9+)
- npm or yarn

### **1. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```
*The API will be available at `http://localhost:8000`*

### **2. Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
*The application will be available at `http://localhost:5173`*

---

## 📊 Project Structure

```text
ML-PROJECT/
├── backend/            # FastAPI Server
│   ├── ml_pipeline/    # ML Models & Training scripts
│   ├── utils/          # PDF Parser & NLP Logic
│   └── main.py         # API Endpoints
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # AI Avatar, Interview, Heatmap, etc.
│   │   └── App.jsx     # Main Application Entry
│   └── package.json
└── README.md
```

---

## 📜 License
This project is licensed under the MIT License.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---
*Built with ❤️ by [Prashant Singh Rawat](https://github.com/Prashant-Singh-Rawat)*
