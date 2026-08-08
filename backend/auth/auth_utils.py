import os
from datetime import datetime, timedelta

from jose import JWTError, jwt
from passlib.context import CryptContext

# ── Secret Key ──────────────────────────────────────────────────────────────
# In production, set JWT_SECRET_KEY as an environment variable.
# The key is written to a local file so it persists across server restarts.
_KEY_FILE = os.path.join(os.path.dirname(__file__), ".jwt_secret")


def _get_or_create_secret_key() -> str:
    if os.path.exists(_KEY_FILE):
        with open(_KEY_FILE, "r") as f:
            return f.read().strip()
    import secrets

    key = secrets.token_hex(64)
    with open(_KEY_FILE, "w") as f:
        f.write(key)
    return key


SECRET_KEY: str = os.environ.get("JWT_SECRET_KEY") or _get_or_create_secret_key()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour

# ── Password Hashing ─────────────────────────────────────────────────────────
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def validate_password_strength(password: str) -> tuple[bool, str]:
    """Returns (is_valid, error_message)."""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter."
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter."
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number."
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        return (
            False,
            "Password must contain at least one special character (!@#$%^&*...).",
        )
    return True, ""


# ── JWT Tokens ───────────────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "iat": datetime.utcnow().isoformat()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user(authorization: str | None = None) -> dict:
    """
    Resolve the authenticated user from an Authorization: Bearer <jwt> header.
    Raises fastapi.HTTPException on failure so route handlers stay thin.
    """
    from fastapi import HTTPException

    from . import user_db

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    payload = verify_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=401, detail="Invalid or expired token. Please log in again."
        )

    user = user_db.get_user_by_email(payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user
