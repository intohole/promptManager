from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class LLMConfigBase(BaseModel):
    model_name: str = Field(..., min_length=1, max_length=255)
    temperature: float = Field(0.1, ge=0.0, le=1.0)
    max_tokens: int = Field(2048, ge=1, le=8192)
    top_p: float = Field(0.9, ge=0.0, le=1.0)
    presence_penalty: float = Field(0.0, ge=-2.0, le=2.0)
    frequency_penalty: float = Field(0.0, ge=-2.0, le=2.0)
    params: Optional[Dict[str, Any]] = None
    is_active: bool = True

class LLMConfigCreate(LLMConfigBase):
    token_id: int = Field(..., ge=1)

class LLMConfigUpdate(BaseModel):
    model_name: Optional[str] = Field(None, min_length=1, max_length=255)
    temperature: Optional[float] = Field(None, ge=0.0, le=1.0)
    max_tokens: Optional[int] = Field(None, ge=1, le=8192)
    top_p: Optional[float] = Field(None, ge=0.0, le=1.0)
    presence_penalty: Optional[float] = Field(None, ge=-2.0, le=2.0)
    frequency_penalty: Optional[float] = Field(None, ge=-2.0, le=2.0)
    params: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class LLMConfig(LLMConfigBase):
    id: int
    token_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
