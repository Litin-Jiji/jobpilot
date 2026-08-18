from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.resumes import router as resumes_router
from app.api.ai_test import router as ai_test_router
from app.api.applications import router as applications_router
from app.api.resume_builder import router as resume_builder_router

from app.database.database import engine


app = FastAPI(
    title="JobPilot AI",
    description="Multi-Agent AI Job Application Assistant",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(resumes_router)
app.include_router(ai_test_router)
app.include_router(applications_router)
app.include_router(resume_builder_router)


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