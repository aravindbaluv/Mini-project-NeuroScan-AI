"""
=============================================================================
MySQL Database Connection & SQLAlchemy Session Manager
Includes Automatic SQLite Fallback for Zero-Config Local Development
=============================================================================
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Configurable MySQL Connection URL (default: root:root@localhost:3306/neuroscan_db)
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "root")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "neuroscan_db")

MYSQL_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
SQLITE_FALLBACK_URL = "sqlite:///./neuroscan_pacs.db"

# Attempt MySQL connection, fallback to SQLite if MySQL service is inactive
try:
    engine = create_engine(
        MYSQL_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        connect_args={"connect_timeout": 3}
    )
    # Test connection
    with engine.connect() as conn:
        print("[Database] Successfully connected to MySQL Database:", MYSQL_DB)
except Exception as e:
    print(f"[Database] MySQL not reachable ({e}). Using persistent local SQLite fallback engine.")
    engine = create_engine(
        SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI Dependency for database session management"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
