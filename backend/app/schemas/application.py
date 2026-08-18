from pydantic import BaseModel


class ApplicationAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str


class ApplicationAnalysisResponse(BaseModel):
    status: str
    candidate_profile: dict
    job_profile: dict
    match_analysis: dict
    optimization: dict