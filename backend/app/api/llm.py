from fastapi import APIRouter, HTTPException
from ..services import LLMService
from typing import List, Dict, Any

router = APIRouter(prefix="/llm", tags=["llm"])
llm_service = LLMService()

@router.post("/generate/")
def generate_completion(prompt: str, model_params: Dict[str, Any] = None):
    """使用LLM生成文本"""
    try:
        completion = llm_service.generate_completion(prompt, **(model_params or {}))
        return {"completion": completion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate completion: {str(e)}")

@router.post("/embedding/")
def generate_embedding(text: str):
    """生成文本嵌入"""
    try:
        embedding = llm_service.generate_embedding(text)
        return {"embedding": embedding}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate embedding: {str(e)}")

@router.post("/embedding/batch/")
def generate_embeddings_batch(texts: List[str]):
    """批量生成文本嵌入"""
    try:
        embeddings = llm_service.generate_embeddings_batch(texts)
        return {"embeddings": embeddings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate embeddings: {str(e)}")
