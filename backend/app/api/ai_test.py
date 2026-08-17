from fastapi import APIRouter

from app.core.config import settings
from app.core.llm import client
from app.crews.resume_crew import analyze_resume
from app.crews.jd_crew import analyze_job_description
from app.crews.match_crew import analyze_match
from app.crews.optimization_crew import optimize_resume

router = APIRouter(
    prefix="/api/ai-test",
    tags=["AI Test"],
)


@router.get("/azure")
def test_azure():

    response = client.responses.create(
        model=settings.AZURE_OPENAI_DEPLOYMENT,
        input="Reply with exactly: AZURE_CONNECTED",
    )

    return {
        "status": "success",
        "response": response.output_text,
        "model": response.model,
    }


@router.post("/resume")
def test_resume_agent():

    sample_resume = """
    LITIN JIJI VARGHESE

    AI Engineer with experience in Generative AI, Agentic AI,
    RAG pipelines and Python backend development.

    Skills:
    Python, FastAPI, LangChain, CrewAI, PyTorch, TensorFlow,
    PostgreSQL, Docker, Azure.

    Experience:
    Associate AI Engineer at MITZ AI Minds.
    Built autonomous AI agents and RAG pipelines.

    Education:
    Bachelor of Engineering in Artificial Intelligence and Machine Learning.
    """

    result = analyze_resume(sample_resume)

    return {
        "status": "success",
        "result": result.model_dump(),
    }

@router.post("/job")
def test_job_agent():

    sample_job_description = """
    AI Engineer

    We are looking for an AI Engineer to build and deploy
    Generative AI and machine learning applications.

    Requirements:
    - Strong Python programming skills
    - Experience with FastAPI
    - Experience building RAG pipelines
    - Knowledge of LangChain
    - Experience with PostgreSQL
    - Familiarity with Azure
    - 1+ years of experience in AI/ML or software development

    Preferred:
    - Experience with CrewAI
    - Experience with Docker
    - Knowledge of vector databases

    Responsibilities:
    - Build and deploy AI applications
    - Develop RAG pipelines
    - Integrate LLM APIs
    - Design REST APIs
    - Collaborate with engineering teams

    Education:
    Bachelor's degree in Computer Science, Artificial Intelligence,
    Machine Learning, or a related field.

    Location:
    Bengaluru, India

    Employment Type:
    Full-time
    """

    result = analyze_job_description(sample_job_description)

    return {
        "status": "success",
        "result": result.model_dump(),
    }

@router.post("/match")
def test_match_agent():

    candidate_profile = analyze_resume(
        """
        LITIN JIJI VARGHESE

        AI Engineer with experience in Generative AI, Agentic AI,
        RAG pipelines and Python backend development.

        Skills:
        Python, FastAPI, LangChain, CrewAI, PyTorch, TensorFlow,
        PostgreSQL, Docker, Azure.

        Experience:
        Associate AI Engineer at MITZ AI Minds.
        Built autonomous AI agents and RAG pipelines.

        Education:
        Bachelor of Engineering in Artificial Intelligence and Machine Learning.
        """
    )

    job_profile = analyze_job_description(
        """
        AI Engineer

        Requirements:
        - Strong Python programming skills
        - Experience with FastAPI
        - Experience building RAG pipelines
        - Knowledge of LangChain
        - Experience with PostgreSQL
        - Familiarity with Azure
        - 1+ years of experience in AI/ML or software development

        Preferred:
        - Experience with CrewAI
        - Experience with Docker
        - Knowledge of vector databases

        Responsibilities:
        - Build and deploy AI applications
        - Develop RAG pipelines
        - Integrate LLM APIs
        - Design REST APIs

        Education:
        Bachelor's degree in Computer Science, Artificial Intelligence,
        Machine Learning, or a related field.

        Location:
        Bengaluru, India

        Employment Type:
        Full-time
        """
    )

    result = analyze_match(
        candidate_profile,
        job_profile,
    )

    return {
        "status": "success",
        "candidate": candidate_profile.model_dump(),
        "job": job_profile.model_dump(),
        "match_analysis": result.model_dump(),
    }

@router.post("/optimize")
def test_optimizer_agent():

    candidate_profile = analyze_resume(
        """
        LITIN JIJI VARGHESE

        AI Engineer with experience in Generative AI, Agentic AI,
        RAG pipelines and Python backend development.

        Skills:
        Python, FastAPI, LangChain, CrewAI, PyTorch, TensorFlow,
        PostgreSQL, Docker, Azure.

        Experience:
        Associate AI Engineer at MITZ AI Minds.
        Built autonomous AI agents and RAG pipelines.

        Education:
        Bachelor of Engineering in Artificial Intelligence and Machine Learning.
        """
    )

    job_profile = analyze_job_description(
        """
        AI Engineer

        Requirements:
        - Strong Python programming skills
        - Experience with FastAPI
        - Experience building RAG pipelines
        - Knowledge of LangChain
        - Experience with PostgreSQL
        - Familiarity with Azure
        - 1+ years of experience in AI/ML or software development

        Preferred:
        - Experience with CrewAI
        - Experience with Docker
        - Knowledge of vector databases

        Responsibilities:
        - Build and deploy AI applications
        - Develop RAG pipelines
        - Integrate LLM APIs
        - Design REST APIs

        Education:
        Bachelor's degree in Computer Science, Artificial Intelligence,
        Machine Learning, or a related field.

        Location:
        Bengaluru, India

        Employment Type:
        Full-time
        """
    )

    match_analysis = analyze_match(
        candidate_profile,
        job_profile,
    )

    optimization = optimize_resume(
        candidate_profile,
        job_profile,
        match_analysis,
    )

    return {
        "status": "success",
        "optimization": optimization.model_dump(),
    }