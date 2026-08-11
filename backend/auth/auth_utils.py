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


# ── Google ID Token Verification ─────────────────────────────────────────────
_GOOGLE_ISSUERS = {"accounts.google.com", "https://accounts.google.com"}


async def verify_google_id_token(id_token: str) -> dict:
    """
    Cryptographically validate a Google Identity Services ID token via tokeninfo.
    Returns verified claims: email, google_id (sub), name.
    Raises ValueError on any validation failure.
    """
    import httpx

    if not id_token or not isinstance(id_token, str) or not id_token.strip():
        raise ValueError("Google ID token is required.")

    client_id = os.environ.get("GOOGLE_CLIENT_ID", "").strip()
    if not client_id:
        raise ValueError("GOOGLE_CLIENT_ID is not configured on this server.")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": id_token.strip()},
            )
    except httpx.HTTPError as exc:
        raise ValueError(f"Failed to reach Google token verification service: {exc}") from exc

    if resp.status_code != 200:
        raise ValueError("Invalid or expired Google ID token.")

    claims = resp.json()
    if claims.get("aud") != client_id:
        raise ValueError("Google ID token audience mismatch.")
    if claims.get("iss") not in _GOOGLE_ISSUERS:
        raise ValueError("Invalid Google ID token issuer.")

    email = claims.get("email")
    sub = claims.get("sub")
    if not email or not sub:
        raise ValueError("Google ID token missing required claims.")

    email_verified = claims.get("email_verified")
    if email_verified in (False, "false", "False", 0, "0"):
        raise ValueError("Google email address is not verified.")

    return {
        "email": email,
        "google_id": str(sub),
        "name": claims.get("name") or email.split("@")[0],
    }
