import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from ml_pipeline.benchmarking import compute_benchmark_comparison

SAMPLE_RESUME = """Jane Doe
jane.doe@example.com | +1 555-0199 | linkedin.com/in/janedoe | github.com/janedoe

Professional Summary
Senior Software Engineer with 5+ years of experience designing, developing, and deploying scalable cloud microservices. Led cross-functional engineering teams to reduce API latency by 42% and improve uptime to 99.99%.

Technical Skills
Languages: Python, JavaScript, TypeScript, Go, SQL
Frameworks: FastAPI, React, Node.js, Django
Cloud & DevOps: Docker, Kubernetes, AWS, CI/CD, Git, Linux
Core Competencies: System Architecture, Microservices, Agile, REST APIs

Work Experience
Senior Software Engineer — TechCorp (2022 - Present)
• Architected high-throughput payment processing microservice handling over 10M daily transactions.
• Optimized database indexing and caching with Redis, reducing query response times by 35%.
• Mentored 4 junior developers in code review best practices and test-driven development.
• Collaborated with product managers to deliver 6 major product milestones on schedule.

Education
Bachelor of Science in Computer Science — University of California (2015 - 2019)

Projects
CloudMonitor: Open-source distributed telemetry monitoring tool with 500+ GitHub stars. Built with Go and React.
"""

def test_benchmarking_peer_comparison():
    res = compute_benchmark_comparison(SAMPLE_RESUME, ['Python', 'AWS', 'Docker'], role='software engineer')
    assert 'overall_percentile' in res
    assert len(res['metrics']) == 4
