from crewai import Crew, Process, Task

from app.agents.resume_agent import resume_analyst
from app.schemas.resume import CandidateProfile


async def analyze_resume(resume_text: str):

    analysis_task = Task(
        description=f"""
Analyze the following resume.

RESUME:
{resume_text}

Extract:

- Candidate name
- Professional summary
- Technical and professional skills
- Work experience
- Education
- Projects
- Certifications
- Languages

Rules:
- Only use information explicitly present in the resume.
- Never invent information.
- Preserve the candidate's actual experience.
- Normalize obvious formatting inconsistencies.
""",
        expected_output=(
            "A complete CandidateProfile containing structured resume "
            "information."
        ),
        output_pydantic=CandidateProfile,
        agent=resume_analyst,
    )

    crew = Crew(
        agents=[resume_analyst],
        tasks=[analysis_task],
        process=Process.sequential,
        verbose=True,
    )

    result = await crew.kickoff_async()

    return result.pydantic