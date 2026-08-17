from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from app.database.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    score = Column(Integer, nullable=True) # ATS fit score
    feedback = Column(JSON, nullable=True) # detailed suggestions / comparison
