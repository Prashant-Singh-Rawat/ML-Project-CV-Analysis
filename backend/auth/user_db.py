import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database and create tables if they don't exist."""
    conn = get_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            hashed_password TEXT,
            google_id TEXT,
            device_fingerprint TEXT NOT NULL,
            failed_attempts INTEGER DEFAULT 0,
            locked_until TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print("[OK] Auth database initialized.")

def create_user(email: str, name: str, hashed_password: str, device_fingerprint: str, google_id: str = None):
    """Create a new user. Returns the created user dict or None on duplicate."""
    conn = get_connection()
    c = conn.cursor()
    try:
        c.execute('''
            INSERT INTO users (email, name, hashed_password, google_id, device_fingerprint)
            VALUES (?, ?, ?, ?, ?)
        ''', (email, name, hashed_password, google_id, device_fingerprint))
        conn.commit()
        return get_user_by_email(email)
    except sqlite3.IntegrityError:
        return None
    finally:
        conn.close()

def get_user_by_email(email: str):
    """Fetch a user by email. Returns dict or None."""
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_google_id(google_id: str):
    """Fetch a user by Google ID. Returns dict or None."""
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE google_id = ?', (google_id,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def update_last_login(email: str):
    """Update last login timestamp and reset failed attempts."""
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        'UPDATE users SET last_login = ?, failed_attempts = 0, locked_until = NULL WHERE email = ?',
        (datetime.utcnow().isoformat(), email)
    )
    conn.commit()
    conn.close()

def increment_failed_attempts(email: str):
    """Increment failed login attempts and lock account after 5 failures."""
    conn = get_connection()
    c = conn.cursor()
    c.execute('SELECT failed_attempts FROM users WHERE email = ?', (email,))
    row = c.fetchone()
    if row:
        attempts = row[0] + 1
        locked_until = None
        if attempts >= 5:
            locked_until = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
        c.execute(
            'UPDATE users SET failed_attempts = ?, locked_until = ? WHERE email = ?',
            (attempts, locked_until, email)
        )
        conn.commit()
    conn.close()

def reset_failed_attempts(email: str):
    """Clear failed attempts and unlock account."""
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        'UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE email = ?',
        (email,)
    )
    conn.commit()
    conn.close()

def update_device_fingerprint(email: str, new_fingerprint: str):
    """Update device fingerprint (admin or re-register flow)."""
    conn = get_connection()
    c = conn.cursor()
    c.execute(
        'UPDATE users SET device_fingerprint = ? WHERE email = ?',
        (new_fingerprint, email)
    )
    conn.commit()
    conn.close()
