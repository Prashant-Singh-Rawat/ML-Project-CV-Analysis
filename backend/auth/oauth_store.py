"""Short-lived in-memory stores for GitHub OAuth CSRF state and one-time auth codes."""

from __future__ import annotations

import secrets
import threading
import time

_lock = threading.Lock()
_oauth_states: dict[str, float] = {}
_auth_codes: dict[str, dict] = {}

_STATE_TTL_SECONDS = 600
_CODE_TTL_SECONDS = 120


def _purge_expired(now: float | None = None) -> None:
    now = now if now is not None else time.time()
    expired_states = [k for k, exp in _oauth_states.items() if exp <= now]
    for k in expired_states:
        _oauth_states.pop(k, None)
    expired_codes = [k for k, payload in _auth_codes.items() if payload["expires_at"] <= now]
    for k in expired_codes:
        _auth_codes.pop(k, None)


def create_oauth_state() -> str:
    state = secrets.token_urlsafe(24)
    with _lock:
        _purge_expired()
        _oauth_states[state] = time.time() + _STATE_TTL_SECONDS
    return state


def consume_oauth_state(state: str | None) -> bool:
    if not state:
        return False
    with _lock:
        _purge_expired()
        exp = _oauth_states.pop(state, None)
        return exp is not None and exp > time.time()


def create_auth_code(session_payload: dict) -> str:
    code = secrets.token_urlsafe(32)
    with _lock:
        _purge_expired()
        _auth_codes[code] = {
            "payload": session_payload,
            "expires_at": time.time() + _CODE_TTL_SECONDS,
        }
    return code


def consume_auth_code(code: str | None) -> dict | None:
    if not code:
        return None
    with _lock:
        _purge_expired()
        entry = _auth_codes.pop(code, None)
        if not entry:
            return None
        if entry["expires_at"] <= time.time():
            return None
        return entry["payload"]
