from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class LLMGenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="The prompt for the LLM")
    model_params: Optional[Dict[str, Any]] = Field(None, description="Additional model parameters")

class LLMGenerateResponse(BaseModel):
    completion: str = Field(..., description="The generated completion")

class EmbeddingRequest(BaseModel):
    text: str = Field(..., min_length=1, description="The text to generate embedding for")

class EmbeddingResponse(BaseModel):
    embedding: List[float] = Field(..., description="The generated embedding")
