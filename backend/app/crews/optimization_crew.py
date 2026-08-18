from crewai import Crew, Process, Task

from app.agents.optimizer_agent import resume_optimizer
from app.schemas.optimization import ResumeOptimization


async def optimize_resume(
    candidate_profile,
    job_profile,
    match_analysis,
):
    optimization_task = Task(
        description=f"""
Optimize the candidate's resume for the target job.

CANDIDATE PROFILE:
{candidate_profile.model_dump_json(indent=2)}

JOB PROFILE:
{job_profile.model_dump_json(indent=2)}

MATCH ANALYSIS:
{match_analysis.model_dump_json(indent=2)}

Your task is to generate honest, ATS-friendly resume improvements.

Requirements:

1. Create an optimized professional summary tailored to the target role.
2. Improve the candidate's existing experience bullets.
3. Do not invent technologies, projects, responsibilities, metrics,
   companies, achievements, or experience.
4. Only add keywords when they are genuinely supported by the
   candidate profile or match analysis.
5. Identify important keywords that should be emphasized.
6. Identify skills that should be highlighted.
7. Provide practical recommendations for improving the resume.
8. Provide ATS-specific improvements.
9. Preserve the original meaning and factual accuracy of the candidate's
   experience.
10. If a bullet is already strong, improve it only when there is a clear
    benefit for ATS alignment.

Return a structured resume optimization.
""",
        expected_output="""
A structured resume optimization containing:

- optimized_summary
- optimized_bullets
- keywords_to_emphasize
- skills_to_highlight
- recommendations
- ats_improvements
""",
        agent=resume_optimizer,
        output_pydantic=ResumeOptimization,
    )

    crew = Crew(
        agents=[resume_optimizer],
        tasks=[optimization_task],
        process=Process.sequential,
        verbose=True,
    )

    result = await crew.kickoff_async()

    return result.pydantic