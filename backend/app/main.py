from fastapi import FastAPI
from sqlalchemy import text

from app.api.resumes import router as resumes_router
from app.api.ai_test import router as ai_test_router
from app.database.database import engine


app = FastAPI(
    title="JobPilot AI",
    description="Multi-Agent AI Job Application Assistant",
    version="0.1.0",
)

app.include_router(resumes_router)
app.include_router(ai_test_router)


@app.get("/")
def root():
    return {
        "application": "JobPilot AI",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/health/db")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {"database": "connected"}