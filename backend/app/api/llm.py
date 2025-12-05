from fastapi import APIRouter, HTTPException, Body
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

@router.post("/test/generate/")
def test_generate(prompt: str = Body(...), llm_config_id: int = Body(...)):
    """测试prompt+token+llm配置的组合"""
    try:
        # 这里需要实现使用指定llm_config_id的逻辑
        # 目前先使用默认配置，后续可以扩展
        completion = llm_service.generate_completion(prompt)
        return {"completion": completion, "llm_config_id": llm_config_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to test generate: {str(e)}")

@router.post("/test/embedding/")
def test_embedding(text: str = Body(...), embedding_config_id: int = Body(...)):
    """测试embedding配置"""
    try:
        # 这里需要实现使用指定embedding_config_id的逻辑
        # 目前先使用默认配置，后续可以扩展
        embedding = llm_service.generate_embedding(text)
        return {"embedding": embedding, "embedding_config_id": embedding_config_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to test embedding: {str(e)}")
