
import logging
import os
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path

LOGS_DIR = Path(__file__).parent.parent.parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)

current_date = datetime.now().strftime("%Y-%m-%d")
LOG_FILE = LOGS_DIR / f"app_{current_date}.log"


class CustomFormatter(logging.Formatter):
    def format(self, record):
        record.filename_lineno = f"{record.filename}:{record.lineno}"
        return super().format(record)

def setup_logger():
    logger = logging.getLogger("Foodie")
    logger.setLevel(logging.INFO)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_format = CustomFormatter(
        "%(asctime)s - %(levelname)s - [%(filename_lineno)s] - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    console_handler.setFormatter(console_format)

    file_handler = TimedRotatingFileHandler(
        LOG_FILE,
        when="midnight",
        interval=1,
        backupCount=30,
        encoding="utf-8"
    )
    file_handler.setLevel(logging.INFO)
    file_format = CustomFormatter(
        "%(asctime)s - %(levelname)s - [%(filename_lineno)s] - %(funcName)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    file_handler.setFormatter(file_format)
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger

logger = setup_logger()

def log_info(message: str, *args, **kwargs):
    """Log info level message"""
    logger.info(message, *args, **kwargs)

def log_error(message: str, *args, **kwargs):
    """Log error level message"""
    logger.error(message, *args, **kwargs)

def log_warning(message: str, *args, **kwargs):
    """Log warning level message"""
    logger.warning(message, *args, **kwargs)

def log_debug(message: str, *args, **kwargs):
    """Log debug level message"""
    logger.debug(message, *args, **kwargs)

# Initialize logging when module is imported
setup_logger()



