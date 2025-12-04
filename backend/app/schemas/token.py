from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TokenBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    value: str = Field(..., min_length=1)
    model_type: str = Field(..., min_length=1, max_length=100)
    is_active: bool = True

class TokenCreate(TokenBase):
    pass

class TokenUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    value: Optional[str] = Field(None, min_length=1)
    model_type: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None

class Token(TokenBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
