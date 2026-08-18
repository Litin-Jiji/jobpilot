from crewai import Crew, Process, Task

from app.agents.jd_agent import jd_analyzer
from app.schemas.job import JobProfile


async def analyze_job_description(job_description: str):

    analysis_task = Task(
        description=f"""
Analyze the following job description.

JOB DESCRIPTION:
{job_description}

Extract:

- Job title
- Company
- Required skills
- Preferred skills
- Required experience
- Responsibilities
- Education requirements
- Location
- Employment type

Rules:
- Only use information explicitly present in the job description.
- Do not invent requirements.
- Separate required skills from preferred skills.
- Preserve the terminology used in the job description.
- Normalize obvious formatting inconsistencies.
""",
        expected_output=(
            "A complete JobProfile containing structured information "
            "about the job description."
        ),
        output_pydantic=JobProfile,
        agent=jd_analyzer,
    )

    crew = Crew(
        agents=[jd_analyzer],
        tasks=[analysis_task],
        process=Process.sequential,
        verbose=True,
    )

    result = await crew.kickoff_async()

    return result.pydantic