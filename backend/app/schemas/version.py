from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class VersionBase(BaseModel):
    content: str = Field(..., min_length=1)
    comment: Optional[str] = Field(None, max_length=1000)
    created_by: Optional[str] = Field(None, max_length=100)

class VersionCreate(VersionBase):
    pass

class Version(VersionBase):
    id: int
    prompt_id: int
    version_number: int
    diff_summary: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class VersionDiff(BaseModel):
    prompt_id: int
    version1: int
    version2: int
    diff: str
