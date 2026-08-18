from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.resume import Resume
from app.models.job import Job
from app.models.analysis import Analysis
from app.crews.resume_builder_crew import build_tailored_resume


router = APIRouter(
    prefix="/api/resume-builder",
    tags=["Resume Builder"],
)


@router.post("/generate")
async def generate_tailored_resume(
    resume_id: int,
    job_id: int,
    db: Session = Depends(get_db),
):
    # Fetch resume
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    # Fetch job
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    # Find the analysis connecting this resume and job
    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.resume_id == resume_id,
            Analysis.job_id == job_id,
        )
        .order_by(Analysis.id.desc())
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail=(
                "No analysis found for this resume and job. "
                "Analyze the application first."
            ),
        )

    feedback = analysis.feedback or {}

    candidate_profile = feedback.get("candidate_profile")
    job_profile = feedback.get("job_profile")
    match_analysis = feedback.get("match_analysis")
    optimization = feedback.get("optimization")

    if not all(
        [
            candidate_profile,
            job_profile,
            match_analysis,
            optimization,
        ]
    ):
        raise HTTPException(
            status_code=400,
            detail="Incomplete analysis data. Please analyze the application again.",
        )

    # Convert stored dictionaries back into the Pydantic models
    from app.schemas.resume import CandidateProfile
    from app.schemas.job import JobProfile
    from app.schemas.match import MatchAnalysis
    from app.schemas.optimization import ResumeOptimization

    candidate_profile = CandidateProfile.model_validate(
        candidate_profile
    )

    job_profile = JobProfile.model_validate(
        job_profile
    )

    match_analysis = MatchAnalysis.model_validate(
        match_analysis
    )

    optimization = ResumeOptimization.model_validate(
        optimization
    )

    # Build tailored resume
    result = await build_tailored_resume(
        candidate_profile=candidate_profile,
        job_profile=job_profile,
        match_analysis=match_analysis,
        optimization=optimization,
    )

    if result is None:
        raise HTTPException(
            status_code=500,
            detail="Resume builder returned no result.",
        )

    return {
        "status": "success",
        "resume_id": resume_id,
        "job_id": job_id,
        "result": result.model_dump(),
    }


from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timezone


class SaveResumeRequest(BaseModel):
    resume_id: int
    job_id: int
    resume_data: Dict[str, Any]
    target_job_title: Optional[str] = None
    target_company: Optional[str] = None
    title: Optional[str] = None


@router.post("/save")
def save_tailored_resume(
    request: SaveResumeRequest,
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.resume_id == request.resume_id,
            Analysis.job_id == request.job_id,
        )
        .order_by(Analysis.id.desc())
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis record not found for this resume and job.",
        )

    feedback = dict(analysis.feedback or {})
    saved_payload = {
        "resume_id": request.resume_id,
        "job_id": request.job_id,
        "resume_data": request.resume_data,
        "target_job_title": request.target_job_title,
        "target_company": request.target_company,
        "title": request.title or f"Tailored Resume for {request.target_job_title or 'Job'}",
        "saved_at": datetime.now(timezone.utc).isoformat(),
    }
    feedback["tailored_resume"] = saved_payload
    analysis.feedback = feedback

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "status": "success",
        "message": "Resume saved successfully",
        "saved_resume": saved_payload,
    }


@router.get("/saved")
def get_saved_tailored_resume(
    resume_id: int,
    job_id: int,
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.resume_id == resume_id,
            Analysis.job_id == job_id,
        )
        .order_by(Analysis.id.desc())
        .first()
    )

    if not analysis or not analysis.feedback or "tailored_resume" not in analysis.feedback:
        return {
            "status": "not_found",
            "saved_resume": None,
        }

    return {
        "status": "success",
        "saved_resume": analysis.feedback["tailored_resume"],
    }