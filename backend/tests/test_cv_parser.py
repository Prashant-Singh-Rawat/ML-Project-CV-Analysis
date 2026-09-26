def test_extracts_csharp_skill():
    from utils.cv_parser import extract_skills

    skills = extract_skills("Skills: C#, Python, React")

    assert "C#" in skills
