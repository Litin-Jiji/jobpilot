from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.schemas.application import (
    ApplicationAnalysisRequest,
    ApplicationAnalysisResponse,
)

from app.services.application_orchestrator import analyze_application
from app.services.resume_parser import extract_text_from_pdf
from app.database.database import get_db

# Import all models so SQLAlchemy registers all foreign-key targets
from app.models.user import User
from app.models.resume import Resume
from app.models.job import Job
from app.models.analysis import Analysis



router = APIRouter(
    prefix="/api/applications",
    tags=["Applications"],
)


@router.post(
    "/analyze",
    response_model=ApplicationAnalysisResponse,
)
async def analyze_application_endpoint(
    request: ApplicationAnalysisRequest,
    db: Session = Depends(get_db),
):
    result = await analyze_application(
        resume_text=request.resume_text,
        job_description=request.job_description,
    )

    return {
        "status": "success",
        "candidate_profile": result["candidate_profile"].model_dump(),
        "job_profile": result["job_profile"].model_dump(),
        "match_analysis": result["match_analysis"].model_dump(),
        "optimization": result["optimization"].model_dump(),
    }


@router.post(
    "/analyze-pdf",
    response_model=ApplicationAnalysisResponse,
)
async def analyze_application_pdf(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
):
    resume_content = await resume.read()

    resume_text = extract_text_from_pdf(resume_content)

    if not resume_text:
        return {
            "status": "error",
            "candidate_profile": {},
            "job_profile": {},
            "match_analysis": {},
            "optimization": {},
        }

    try:
        # Save resume
        resume_record = Resume(
            filename=resume.filename,
            extracted_text=resume_text,
        )

        db.add(resume_record)
        db.commit()
        db.refresh(resume_record)

        # Save job description
        job_record = Job(
            title="Unknown",
            description=job_description,
        )

        db.add(job_record)
        db.commit()
        db.refresh(job_record)

        # Run AI pipeline
        result = await analyze_application(
            resume_text=resume_text,
            job_description=job_description,
        )

        match_analysis = result["match_analysis"].model_dump()

        score = match_analysis.get("ats_score")

        feedback = {
            "candidate_profile": result["candidate_profile"].model_dump(),
            "job_profile": result["job_profile"].model_dump(),
            "match_analysis": match_analysis,
            "optimization": result["optimization"].model_dump(),
        }

        # Save analysis
        analysis_record = Analysis(
            resume_id=resume_record.id,
            job_id=job_record.id,
            score=score,
            feedback=feedback,
        )

        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

        return {
            "status": "success",
            "candidate_profile": feedback["candidate_profile"],
            "job_profile": feedback["job_profile"],
            "match_analysis": feedback["match_analysis"],
            "optimization": feedback["optimization"],
        }

    except Exception:
        db.rollback()
        raise

@router.get("/{application_id}")
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .filter(Analysis.id == application_id)
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return {
        "status": "success",
        "application": {
            "id": analysis.id,
            "resume_id": analysis.resume_id,
            "job_id": analysis.job_id,
            "score": analysis.score,
            "feedback": analysis.feedback,
        },
    }

@router.get("/")
def get_applications(
    db: Session = Depends(get_db),
):
    analyses = (
        db.query(Analysis)
        .order_by(Analysis.id.desc())
        .all()
    )

    return {
        "status": "success",
        "count": len(analyses),
        "applications": [
            {
                "id": analysis.id,
                "resume_id": analysis.resume_id,
                "job_id": analysis.job_id,
                "score": analysis.score,
                "feedback": analysis.feedback,
            }
            for analysis in analyses
        ],
    }