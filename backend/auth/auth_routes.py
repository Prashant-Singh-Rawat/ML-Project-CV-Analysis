from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from . import user_db, auth_utils

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Request / Response Models ─────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str
    device_fingerprint: str

class LoginRequest(BaseModel):
    email: str
    password: str
    device_fingerprint: str

class GoogleAuthRequest(BaseModel):
    google_id_token: str       # JWT token from Google Identity Services
    name: str
    email: str
    google_id: str
    device_fingerprint: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


# ── Helper ────────────────────────────────────────────────────────────────────

def _check_account_lock(user: dict, email: str):
    """Raise 423 if account is locked, cleanup if lock expired."""
    if user.get("locked_until"):
        locked_until = datetime.fromisoformat(user["locked_until"])
        if datetime.utcnow() < locked_until:
            remaining_mins = int((locked_until - datetime.utcnow()).total_seconds() / 60) + 1
            raise HTTPException(
                status_code=423,
                detail=f"🔒 Account temporarily locked after too many failed attempts. "
                       f"Try again in {remaining_mins} minute(s)."
            )
        else:
            user_db.reset_failed_attempts(email)  # lock expired — reset


def _build_token_response(user: dict, device_fingerprint: str) -> dict:
    token = auth_utils.create_access_token({
        "sub": user["email"],
        "device": device_fingerprint,
        "name": user["name"],
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user["name"]}
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, summary="Register a new account")
async def register(req: RegisterRequest):
    # 1. Validate password strength
    is_strong, msg = auth_utils.validate_password_strength(req.password)
    if not is_strong:
        raise HTTPException(status_code=422, detail=f"Weak password: {msg}")

    # 2. Check duplicate email
    existing = user_db.get_user_by_email(req.email)
    if existing:
        # Check if the account is already bound to this same device → allow re-login
        if existing["device_fingerprint"] == req.device_fingerprint:
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists. Please log in instead."
            )
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    # 3. Hash password and store user
    hashed = auth_utils.hash_password(req.password)
    user = user_db.create_user(
        email=req.email,
        name=req.name,
        hashed_password=hashed,
        device_fingerprint=req.device_fingerprint
    )

    if not user:
        raise HTTPException(status_code=500, detail="Failed to create account. Please try again.")

    return _build_token_response(user, req.device_fingerprint)


@router.post("/login", response_model=TokenResponse, summary="Login with email + password")
async def login(req: LoginRequest):
    # 1. Lookup user
    user = user_db.get_user_by_email(req.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # 2. Check account lock
    _check_account_lock(user, req.email)

    # 3. Verify password
    if not user.get("hashed_password") or not auth_utils.verify_password(req.password, user["hashed_password"]):
        user_db.increment_failed_attempts(req.email)
        attempts_left = max(0, 5 - (user.get("failed_attempts", 0) + 1))
        raise HTTPException(
            status_code=401,
            detail=f"Invalid email or password. {attempts_left} attempt(s) remaining before lockout."
        )

    # 4. Single-device enforcement
    if user["device_fingerprint"] != req.device_fingerprint:
        raise HTTPException(
            status_code=403,
            detail="🔒 Security Alert: This account is registered on a different device. "
                   "Access is only allowed from the original device for security. "
                   "Contact support if you have changed your device."
        )

    # 5. Success
    user_db.update_last_login(req.email)
    return _build_token_response(user, req.device_fingerprint)


@router.post("/google", response_model=TokenResponse, summary="Login / Register with Google")
async def google_auth(req: GoogleAuthRequest):
    """
    Accepts the Google ID token from the Google Identity Services library.
    In production, verify the token with google-auth-library. 
    For now we trust the sub (google_id) as identifier.
    """
    # Check by google_id first
    user = user_db.get_user_by_google_id(req.google_id)

    if user:
        # Returning Google user — enforce device binding
        if user["device_fingerprint"] != req.device_fingerprint:
            raise HTTPException(
                status_code=403,
                detail="🔒 Security Alert: This Google account is registered on a different device. "
                       "Access denied."
            )
        user_db.update_last_login(user["email"])
        return _build_token_response(user, req.device_fingerprint)

    # New Google user — check if email already used with password
    existing_by_email = user_db.get_user_by_email(req.email)
    if existing_by_email:
        raise HTTPException(
            status_code=409,
            detail="This email is already registered with a password account. Please log in with email/password."
        )

    # Create new account (no password for Google users)
    user = user_db.create_user(
        email=req.email,
        name=req.name,
        hashed_password=None,
        device_fingerprint=req.device_fingerprint,
        google_id=req.google_id
    )

    if not user:
        raise HTTPException(status_code=500, detail="Failed to create Google account.")

    return _build_token_response(user, req.device_fingerprint)


@router.get("/me", summary="Get current user info")
async def get_me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated.")

    token = authorization.split(" ", 1)[1]
    payload = auth_utils.verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token. Please log in again.")

    user = user_db.get_user_by_email(payload["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"id": user["id"], "email": user["email"], "name": user["name"]}


@router.post("/logout", summary="Logout (client should discard JWT)")
async def logout():
    # JWT is stateless — client must delete token from localStorage
    return {"message": "Logged out successfully. Please clear your local session."}
