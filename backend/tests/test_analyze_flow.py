from fastapi.testclient import TestClient
import sys
import os

# Add backend directory to sys.path so we can import main
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_analyze_flow_success():
    """Test that a valid PDF successfully returns a hiring analysis."""
    # Create a dummy PDF in memory
    from fpdf import FPDF

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("helvetica", "B", 16)
    pdf.cell(40, 10, "Test User Resume")
    pdf.ln(10)
    pdf.set_font("helvetica", "", 12)
    pdf.cell(40, 10, "Skills: Python, Machine Learning, React, JavaScript")

    # Get PDF bytes
    pdf_bytes = pdf.output(dest="S")
    if isinstance(pdf_bytes, str):
        pdf_bytes = pdf_bytes.encode("latin1")

    # Send request to /analyze
    files = {"cv_file": ("resume.pdf", pdf_bytes, "application/pdf")}
    data = {"target_company": "Google", "cgpa": "8.5"}

    response = client.post("/analyze", files=files, data=data)

    # Should not hang, should return 200 OK
    assert response.status_code == 200

    json_data = response.json()
    assert "hiring_analysis" in json_data
    assert "best_fit_chance" in json_data["hiring_analysis"]
    assert "best_fit_role" in json_data["hiring_analysis"]


def test_analyze_flow_invalid_file():
    """Test that submitting a non-PDF file returns a 400."""
    files = {"cv_file": ("resume.txt", b"This is just a text file.", "text/plain")}
    data = {"target_company": "Google", "cgpa": "8.5"}

    response = client.post("/analyze", files=files, data=data)
    assert response.status_code == 400
    assert "Only PDF files are supported" in response.json()["detail"]
