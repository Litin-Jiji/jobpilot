from crewai import Agent

from app.core.llm import llm


resume_analyst = Agent(
    role="Resume Analyst",
    goal=(
        "Analyze a candidate's resume and extract accurate, structured "
        "professional information without inventing or modifying facts."
    ),
    backstory=(
        "You are an expert technical recruiter and resume analyst. "
        "You specialize in extracting structured information from resumes "
        "for downstream ATS analysis and job matching systems."
    ),
    llm=llm,
    verbose=True,
)