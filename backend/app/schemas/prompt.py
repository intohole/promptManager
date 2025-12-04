from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PromptBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    content: str = Field(..., min_length=1)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    model_params: Optional[Dict[str, Any]] = None

class PromptCreate(PromptBase):
    pass

class PromptUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    model_params: Optional[Dict[str, Any]] = None

class Prompt(PromptBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
