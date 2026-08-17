from pydantic import BaseModel, Field


class JobProfile(BaseModel):
    job_title: str = ""
    company: str = ""

    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)

    experience_required: str = ""

    responsibilities: list[str] = Field(default_factory=list)

    education_requirements: list[str] = Field(default_factory=list)

    location: str = ""
    employment_type: str = ""