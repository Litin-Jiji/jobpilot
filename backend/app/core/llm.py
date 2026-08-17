from openai import OpenAI
from crewai import LLM

from app.core.config import settings


# Direct OpenAI-compatible Azure client
client = OpenAI(
    api_key=settings.AZURE_OPENAI_API_KEY,
    base_url=settings.AZURE_OPENAI_ENDPOINT,
)


# CrewAI LLM
llm = LLM(
    model=f"openai/{settings.AZURE_OPENAI_DEPLOYMENT}",
    api_key=settings.AZURE_OPENAI_API_KEY,
    base_url=settings.AZURE_OPENAI_ENDPOINT,
)