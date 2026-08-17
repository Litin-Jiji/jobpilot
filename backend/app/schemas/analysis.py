from pydantic import BaseModel
from typing import Optional, Dict, Any

class AnalysisBase(BaseModel):
    resume_id: int
    job_id: int

class AnalysisCreate(AnalysisBase):
    score: Optional[int] = None
    feedback: Optional[Dict[str, Any]] = None

class AnalysisResponse(AnalysisBase):
    id: int
    score: Optional[int] = None
    feedback: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
