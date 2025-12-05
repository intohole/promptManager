from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class LLMConfigBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    model_name: str = Field(..., min_length=1, max_length=255)
    # 通用模型参数，使用JSON格式存储，适应不同LLM提供商的不同参数需求
    params: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

class LLMConfigCreate(LLMConfigBase):
    token_id: int = Field(..., ge=1)

class LLMConfigUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    model_name: Optional[str] = Field(None, min_length=1, max_length=255)
    params: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    token_id: Optional[int] = Field(None, ge=1)

class LLMConfig(LLMConfigBase):
    id: int
    token_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
