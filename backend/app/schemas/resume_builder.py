from typing import List, Optional

from pydantic import BaseModel, Field


class ResumeExperience(BaseModel):
    company: str
    role: str
    duration: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)


class ResumeProject(BaseModel):
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)


class ResumeEducation(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    duration: Optional[str] = None


class TailoredResume(BaseModel):
    name: str
    professional_summary: str

    skills: List[str] = Field(default_factory=list)

    experience: List[ResumeExperience] = Field(
        default_factory=list
    )

    projects: List[ResumeProject] = Field(
        default_factory=list
    )

    education: List[ResumeEducation] = Field(
        default_factory=list
    )

    certifications: List[str] = Field(
        default_factory=list
    )


class ResumeChange(BaseModel):
    section: str
    original: str
    optimized: str
    reason: str


class ResumeBuilderResult(BaseModel):
    resume: TailoredResume

    ats_score: Optional[int] = None

    changes: List[ResumeChange] = Field(
        default_factory=list
    )