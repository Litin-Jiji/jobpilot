from fastapi import APIRouter

from app.core.config import settings
from app.core.llm import client
from app.crews.resume_crew import analyze_resume


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