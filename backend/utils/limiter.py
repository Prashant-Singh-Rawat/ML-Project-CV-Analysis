import os

try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.errors import RateLimitExceeded
    from slowapi.util import get_remote_address
    HAS_SLOWAPI = True
except ImportError:
    HAS_SLOWAPI = False
    RateLimitExceeded = Exception
    _rate_limit_exceeded_handler = None

    class Limiter:
        def __init__(self, *args, **kwargs):
            pass

        def limit(self, *args, **kwargs):
            def decorator(func):
                return func
            return decorator

    def get_remote_address(*args, **kwargs):
        return "127.0.0.1"

# Limits are configurable via environment variables so operators can tune them
RATE_ANALYZE = os.getenv("RATE_ANALYZE", "5/minute")
RATE_FEATURES_HVY = os.getenv("RATE_FEATURES_HVY", "10/minute")
RATE_FEATURES_LGT = os.getenv("RATE_FEATURES_LGT", "20/minute")
RATE_AUTH = os.getenv("RATE_AUTH", "10/minute")

limiter = Limiter(key_func=get_remote_address)

