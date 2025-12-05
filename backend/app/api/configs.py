from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from ..services import ConfigService

router = APIRouter(prefix="/configs", tags=["configs"])

# 创建配置服务实例
config_service = ConfigService()

@router.get("/")
def get_config():
    """获取当前配置"""
    return {
        "llm": config_service.get_llm_config(),
        "embedding": config_service.get_embedding_config(),
        "chroma": config_service.get_chroma_config()
    }

@router.get("/llm")
def get_llm_config():
    """获取LLM配置"""
    return config_service.get_llm_config()

@router.get("/embedding")
def get_embedding_config():
    """获取嵌入服务配置"""
    return config_service.get_embedding_config()

@router.get("/chroma")
def get_chroma_config():
    """获取Chroma配置"""
    return config_service.get_chroma_config()

@router.post("/")
def update_config(config: Dict[str, Any]):
    """更新配置"""
    try:
        config_service.save_config(config)
        return {"message": "Config updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update config: {str(e)}")

@router.post("/reload")
def reload_config():
    """重新加载配置文件"""
    try:
        config_service.reload_config()
        return {"message": "Config reloaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reload config: {str(e)}")
