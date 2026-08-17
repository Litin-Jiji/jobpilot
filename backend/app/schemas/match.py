from pydantic import BaseModel, Field


class MatchAnalysis(BaseModel):
    overall_match_score: float = 0.0
    ats_score: float = 0.0

    matching_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)

    experience_match: str = ""
    education_match: str = ""

    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)

    recommendations: list[str] = Field(default_factory=list)

    summary: str = ""