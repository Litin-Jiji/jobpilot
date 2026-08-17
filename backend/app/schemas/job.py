from pydantic import BaseModel
from typing import Optional

class JobBase(BaseModel):
    title: str
    description: str
    company: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int

    class Config:
        from_attributes = True
