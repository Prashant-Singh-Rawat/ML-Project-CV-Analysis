import json
from .user_db import get_connection


def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS resume_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            resume_name TEXT NOT NULL,
            ats_score REAL DEFAULT 0,
            skills_json TEXT DEFAULT '[]',
            projects_json TEXT DEFAULT '[]',
            experience_json TEXT DEFAULT '[]',
            certifications_json TEXT DEFAULT '[]',
            analysis_json TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        """
    )
    conn.commit()
    conn.close()


def create_resume_version(
    user_id,
    resume_name,
    ats_score,
    skills,
    projects,
    experience,
    certifications,
    analysis_result,
):
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        """
        INSERT INTO resume_history (
            user_id, resume_name, ats_score, skills_json, projects_json,
            experience_json, certifications_json, analysis_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            resume_name,
            ats_score,
            json.dumps(skills),
            json.dumps(projects),
            json.dumps(experience),
            json.dumps(certifications),
            json.dumps(analysis_result),
        ),
    )
    conn.commit()
    version_id = c.lastrowid
    conn.close()
    return get_resume_version(version_id)


def list_resume_versions(user_id):
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        """
        SELECT id, user_id, resume_name, ats_score, skills_json, projects_json,
               experience_json, certifications_json, analysis_json, created_at
        FROM resume_history
        WHERE user_id = ?
        ORDER BY created_at DESC, id DESC
        """,
        (user_id,),
    )
    rows = c.fetchall()
    conn.close()
    return [_row_to_version(row) for row in rows]


def get_resume_version(version_id):
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        """
        SELECT id, user_id, resume_name, ats_score, skills_json, projects_json,
               experience_json, certifications_json, analysis_json, created_at
        FROM resume_history
        WHERE id = ?
        """,
        (version_id,),
    )
    row = c.fetchone()
    conn.close()
    return _row_to_version(row) if row else None


def _loads(value, fallback):
    try:
        return json.loads(value) if value else fallback
    except json.JSONDecodeError:
        return fallback


def _row_to_version(row):
    return {
        "id": row["id"],
        "user_id": row["user_id"],
        "resume_name": row["resume_name"],
        "ats_score": row["ats_score"],
        "skills": _loads(row["skills_json"], []),
        "projects": _loads(row["projects_json"], []),
        "experience": _loads(row["experience_json"], []),
        "certifications": _loads(row["certifications_json"], []),
        "analysis_result": _loads(row["analysis_json"], {}),
        "created_at": row["created_at"],
    }
