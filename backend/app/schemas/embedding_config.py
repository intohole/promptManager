from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class EmbeddingConfigBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    model_name: str = Field(..., min_length=1, max_length=255)
    # 通用嵌入模型参数，使用JSON格式存储，适应不同嵌入服务提供商的不同参数需求
    params: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True

class EmbeddingConfigCreate(EmbeddingConfigBase):
    token_id: int = Field(..., ge=1)

class EmbeddingConfigUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    model_name: Optional[str] = Field(None, min_length=1, max_length=255)
    params: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class EmbeddingConfig(EmbeddingConfigBase):
    id: int
    token_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
