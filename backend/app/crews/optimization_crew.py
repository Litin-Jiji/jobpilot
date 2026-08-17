from crewai import Crew, Process, Task

from app.agents.optimizer_agent import resume_optimizer
from app.schemas.optimization import ResumeOptimization


def optimize_resume(
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

Your objectives:

1. Rewrite the professional summary to align with the target role.
2. Improve existing experience bullets for clarity and ATS relevance.
3. Identify keywords from the job description that are already supported
   by the candidate's experience.
4. Identify skills that should be highlighted more prominently.
5. Recommend ATS improvements.
6. Preserve factual accuracy.

STRICT RULES:

- Never invent work experience.
- Never invent skills.
- Never invent companies.
- Never invent certifications.
- Never invent metrics.
- Never claim the candidate has a missing skill.
- Only rewrite or emphasize information already supported by the
  candidate profile.
- Missing skills should be reported as recommendations rather than
  added to the resume.
- Preserve the candidate's actual experience and background.

The optimized resume should be targeted specifically toward the
provided job profile.
""",
        expected_output=(
            "A complete ResumeOptimization containing an optimized "
            "professional summary, improved resume bullets, ATS keywords, "
            "skills to highlight, recommendations, and ATS improvements."
        ),
        output_pydantic=ResumeOptimization,
        agent=resume_optimizer,
    )

    crew = Crew(
        agents=[resume_optimizer],
        tasks=[optimization_task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return result.pydantic