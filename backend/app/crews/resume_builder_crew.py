from crewai import Agent, Crew, Task

from app.core.llm import llm
from app.schemas.resume_builder import ResumeBuilderResult


def create_resume_builder_agent() -> Agent:
    return Agent(
        role="AI Resume Builder",

        goal=(
            "Create a highly relevant, ATS-friendly tailored resume for a "
            "specific job while preserving the candidate's factual experience."
        ),

        backstory=(
            "You are an expert technical recruiter, ATS specialist, and "
            "professional resume strategist specializing in AI and software "
            "engineering roles. You tailor resumes by improving clarity, "
            "keyword alignment, technical relevance, and presentation. "
            "You never fabricate information. Every technology, responsibility, "
            "achievement, metric, company, project, education detail, and "
            "experience claim must be supported by the candidate's original "
            "resume or structured candidate profile."
        ),

        llm=llm,
        verbose=True,
    )


async def build_tailored_resume(
    candidate_profile,
    job_profile,
    match_analysis,
    optimization,
):
    # IMPORTANT:
    # Create a NEW agent for every request.
    resume_builder = create_resume_builder_agent()

    task = Task(
        description=f"""
Create a job-tailored resume using the candidate profile,
target job, match analysis, and existing resume optimization.

========================
CANDIDATE PROFILE
========================

{candidate_profile}

========================
JOB PROFILE
========================

{job_profile}

========================
MATCH ANALYSIS
========================

{match_analysis}

========================
EXISTING OPTIMIZATION
========================

{optimization}

========================
CORE RULES
========================

1. FACTUAL ACCURACY

Only use information supported by the candidate profile.

Never invent:
- technologies
- frameworks
- tools
- companies
- job titles
- responsibilities
- projects
- achievements
- metrics
- certifications
- education
- years of experience

2. JOB ALIGNMENT

Tailor the resume toward the target job.

Prioritize existing experience and skills that are relevant
to the target position.

Use terminology from the job description only when it
accurately describes something the candidate has actually done.

3. EXPERIENCE

Preserve important factual experience.

Improve bullet wording for:
- clarity
- technical specificity
- ATS relevance
- impact

Do not rewrite a strong bullet unnecessarily.

4. SKILLS

Prioritize the candidate's existing skills relevant to the job.

Do not add missing skills simply because they appear in the
job description.

5. PROJECTS

Only include projects supported by the candidate profile.

Do not create projects.

6. EDUCATION

Preserve actual education information.

7. CERTIFICATIONS

Only include certifications explicitly supported by the profile.

8. SUMMARY

Create a concise job-targeted professional summary containing:
- professional identity
- relevant technical strengths
- relevant AI/software experience
- target-role alignment

9. ATS OPTIMIZATION

Use clear standard resume terminology.

Prioritize relevant keywords that already exist in the candidate's
experience.

Avoid keyword stuffing.

10. CHANGES

For meaningful modifications provide:
- section
- original
- optimized
- reason

Do not create a change entry when no meaningful change was made.

11. SCORE

Provide an estimated ATS score from 0 to 100 based on alignment
between the tailored resume and the target job.

Do not artificially inflate the score.

Return a structured ResumeBuilderResult.
""",

        expected_output=(
            "A valid structured ResumeBuilderResult containing the "
            "tailored resume, ATS score, and meaningful changes."
        ),

        agent=resume_builder,

        output_pydantic=ResumeBuilderResult,
    )

    # IMPORTANT:
    # This Crew is also request-local.
    crew = Crew(
        agents=[resume_builder],
        tasks=[task],
        verbose=True,
    )

    result = await crew.kickoff_async()

    return result.pydantic