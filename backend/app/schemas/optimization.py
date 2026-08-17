from pydantic import BaseModel, Field


class OptimizedBullet(BaseModel):
    original: str = ""
    optimized: str = ""
    reason: str = ""


class ResumeOptimization(BaseModel):
    optimized_summary: str = ""

    optimized_bullets: list[OptimizedBullet] = Field(
        default_factory=list
    )

    keywords_to_emphasize: list[str] = Field(
        default_factory=list
    )

    skills_to_highlight: list[str] = Field(
        default_factory=list
    )

    recommendations: list[str] = Field(
        default_factory=list
    )

    ats_improvements: list[str] = Field(
        default_factory=list
    )