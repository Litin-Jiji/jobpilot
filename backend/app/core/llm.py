from openai import OpenAI
from crewai import LLM

from app.core.config import settings


client = OpenAI(
    api_key=settings.AZURE_OPENAI_API_KEY,
    base_url=settings.AZURE_OPENAI_ENDPOINT,
)


llm = LLM(
    model=f"openai/{settings.AZURE_OPENAI_DEPLOYMENT}",
    api_key=settings.AZURE_OPENAI_API_KEY,
    base_url=settings.AZURE_OPENAI_ENDPOINT,
)