import logging
from pythonjsonlogger import jsonlogger
import sys

def setup_logger(name="TonyCV"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger

    logHandler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(levelname)s %(name)s %(message)s %(request_id)s %(latency)s',
        datefmt='%Y-%m-%dT%H:%M:%SZ'
    )
    logHandler.setFormatter(formatter)
    logger.addHandler(logHandler)
    
    # Also set up a default fallback for Uvicorn errors
    uvicorn_logger = logging.getLogger("uvicorn.error")
    uvicorn_logger.setLevel(logging.INFO)
    if not uvicorn_logger.handlers:
        uvicorn_logger.addHandler(logHandler)
        
    return logger

logger = setup_logger()
