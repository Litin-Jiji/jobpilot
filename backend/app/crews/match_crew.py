from crewai import Crew, Process, Task

from app.agents.match_agent import match_analyzer
from app.schemas.match import MatchAnalysis


def analyze_match(candidate_profile, job_profile):

    analysis_task = Task(
        description=f"""
Compare the following candidate profile against the job profile.

CANDIDATE PROFILE:
{candidate_profile.model_dump_json(indent=2)}

JOB PROFILE:
{job_profile.model_dump_json(indent=2)}

Analyze:

1. Overall job match score from 0 to 100.
2. ATS compatibility score from 0 to 100.
3. Skills that match the job requirements.
4. Required skills missing from the candidate profile.
5. Whether the candidate's experience matches the requirement.
6. Whether the candidate's education matches the requirement.
7. Candidate strengths for this specific position.
8. Candidate weaknesses or gaps.
9. Specific recommendations for improving the candidate's application.
10. A concise overall assessment.

Scoring guidelines:

- 90-100: Excellent match
- 75-89: Strong match
- 60-74: Moderate match
- 40-59: Weak match
- Below 40: Poor match

Important:
- Base the analysis only on the supplied candidate and job profiles.
- Do not invent candidate experience or skills.
- Do not assume that a missing skill is present.
- Distinguish required skills from preferred skills.
- Give realistic scores rather than automatically giving high scores.
""",
        expected_output=(
            "A complete MatchAnalysis containing job match score, ATS score, "
            "matching skills, missing skills, experience and education "
            "assessment, strengths, weaknesses, recommendations, and summary."
        ),
        output_pydantic=MatchAnalysis,
        agent=match_analyzer,
    )

    crew = Crew(
        agents=[match_analyzer],
        tasks=[analysis_task],
        process=Process.sequential,
        verbose=True,
    )

    result = crew.kickoff()

    return result.pydantic