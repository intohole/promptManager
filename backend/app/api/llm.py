from fastapi import APIRouter, HTTPException, Body, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..services import LLMService
from ..database.config import get_db
from ..models import LLMConfig as LLMConfigModel
from ..models import EmbeddingConfig as EmbeddingConfigModel
from ..models import Token as TokenModel

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
def test_generate(prompt: str = Body(...), llm_config_id: int = Body(...), db: Session = Depends(get_db)):
    """测试prompt+token+llm配置的组合"""
    try:
        # 从数据库获取指定的LLM配置
        llm_config = db.query(LLMConfigModel).filter(LLMConfigModel.id == llm_config_id).first()
        if not llm_config:
            raise HTTPException(status_code=404, detail="LLM config not found")
        
        # 获取关联的Token信息
        token = db.query(TokenModel).filter(TokenModel.id == llm_config.token_id).first()
        if not token:
            raise HTTPException(status_code=404, detail="Token not found for this LLM config")
        
        # 构建用于调用LLM的配置
        llm_call_config = {
            "model": llm_config.model_name,
            "api_key": token.value,  # 从数据库获取实际的token值
            "base_url": token.base_url or "",
            "temperature": llm_config.params.get("temperature", 0.7),
            "max_tokens": llm_config.params.get("max_tokens", 1000)
        }
        
        # 使用从数据库获取的配置调用LLM服务
        completion = llm_service.generate_completion(prompt, llm_config=llm_call_config)
        return {"completion": completion, "llm_config_id": llm_config_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to test generate: {str(e)}")

@router.post("/test/embedding/")
def test_embedding(text: str = Body(...), embedding_config_id: int = Body(...), db: Session = Depends(get_db)):
    """测试embedding配置"""
    try:
        # 从数据库获取指定的Embedding配置
        embedding_config = db.query(EmbeddingConfigModel).filter(EmbeddingConfigModel.id == embedding_config_id).first()
        if not embedding_config:
            raise HTTPException(status_code=404, detail="Embedding config not found")
        
        # 获取关联的Token信息
        token = db.query(TokenModel).filter(TokenModel.id == embedding_config.token_id).first()
        if not token:
            raise HTTPException(status_code=404, detail="Token not found for this Embedding config")
        
        # 构建用于调用Embedding的配置
        embedding_call_config = {
            "model": embedding_config.model_name,
            "api_key": token.value,  # 从数据库获取实际的token值
            "base_url": token.base_url or "",
            "normalize": embedding_config.params.get("normalize", True)
        }
        
        # 使用从数据库获取的配置调用Embedding服务
        embedding = llm_service.generate_embedding(text, embedding_config=embedding_call_config)
        return {"embedding": embedding, "embedding_config_id": embedding_config_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to test embedding: {str(e)}")
