import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from utils.logger import logger

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        try:
            response = await call_next(request)
        except Exception as e:
            # We must log timing even if an exception occurs
            process_time = time.time() - start_time
            request_id = getattr(request.state, "request_id", "unknown")
            logger.error(f"Request Failed", extra={
                "request_id": request_id,
                "latency": f"{process_time:.4f}s",
                "endpoint": request.url.path,
                "error": str(e)
            })
            raise e
            
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        request_id = getattr(request.state, "request_id", "unknown")
        
        # Log slow requests or regular requests
        log_data = {
            "request_id": request_id,
            "latency": f"{process_time:.4f}s",
            "endpoint": request.url.path,
            "method": request.method,
            "status_code": response.status_code
        }
        
        if process_time > 2.0:
            logger.warning("Slow API Request detected", extra=log_data)
        else:
            logger.info("API Request", extra=log_data)
            
        return response
