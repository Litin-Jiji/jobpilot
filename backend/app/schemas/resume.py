from pydantic import BaseModel, Field


class ExperienceItem(BaseModel):
    company: str = ""
    role: str = ""
    duration: str = ""
    description: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    institution: str = ""
    degree: str = ""
    field: str = ""
    duration: str = ""


class ProjectItem(BaseModel):
    name: str = ""
    technologies: list[str] = Field(default_factory=list)
    description: list[str] = Field(default_factory=list)


class CandidateProfile(BaseModel):
    name: str = ""
    professional_summary: str = ""

    skills: list[str] = Field(default_factory=list)

    experience: list[ExperienceItem] = Field(default_factory=list)

    education: list[EducationItem] = Field(default_factory=list)

    projects: list[ProjectItem] = Field(default_factory=list)

    certifications: list[str] = Field(default_factory=list)

    languages: list[str] = Field(default_factory=list)