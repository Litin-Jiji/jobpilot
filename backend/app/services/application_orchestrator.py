from app.crews.resume_crew import analyze_resume
from app.crews.jd_crew import analyze_job_description
from app.crews.match_crew import analyze_match
from app.crews.optimization_crew import optimize_resume


async def analyze_application(
    resume_text: str,
    job_description: str,
):
    # Agent 1: Resume Analysis
    candidate_profile = await analyze_resume(resume_text)

    # Agent 2: Job Description Analysis
    job_profile = await analyze_job_description(job_description)

    # Agent 3: Candidate-Job Matching
    match_analysis = await analyze_match(
        candidate_profile,
        job_profile,
    )

    # Agent 4: Resume Optimization
    optimization = await optimize_resume(
        candidate_profile,
        job_profile,
        match_analysis,
    )

    return {
        "candidate_profile": candidate_profile,
        "job_profile": job_profile,
        "match_analysis": match_analysis,
        "optimization": optimization,
    }