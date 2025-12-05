from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..schemas import EmbeddingConfig, EmbeddingConfigCreate, EmbeddingConfigUpdate
from ..models import EmbeddingConfig as EmbeddingConfigModel

router = APIRouter(prefix="/embedding-configs", tags=["embedding_configs"])

@router.post("/", response_model=EmbeddingConfig)
def create_embedding_config(embedding_config: EmbeddingConfigCreate, db: Session = Depends(get_db)):
    """创建嵌入配置"""
    db_embedding_config = EmbeddingConfigModel(**embedding_config.dict())
    db.add(db_embedding_config)
    db.commit()
    db.refresh(db_embedding_config)
    return db_embedding_config

@router.get("/", response_model=List[EmbeddingConfig])
def read_embedding_configs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取嵌入配置列表"""
    return db.query(EmbeddingConfigModel).offset(skip).limit(limit).all()

@router.get("/{embedding_config_id}", response_model=EmbeddingConfig)
def read_embedding_config(embedding_config_id: int, db: Session = Depends(get_db)):
    """获取单个嵌入配置"""
    db_embedding_config = db.query(EmbeddingConfigModel).filter(EmbeddingConfigModel.id == embedding_config_id).first()
    if db_embedding_config is None:
        raise HTTPException(status_code=404, detail="Embedding config not found")
    return db_embedding_config

@router.get("/token/{token_id}", response_model=List[EmbeddingConfig])
def read_embedding_configs_by_token(token_id: int, db: Session = Depends(get_db)):
    """获取指定Token的嵌入配置"""
    return db.query(EmbeddingConfigModel).filter(EmbeddingConfigModel.token_id == token_id).all()

@router.put("/{embedding_config_id}", response_model=EmbeddingConfig)
def update_embedding_config(embedding_config_id: int, embedding_config_update: EmbeddingConfigUpdate, db: Session = Depends(get_db)):
    """更新嵌入配置"""
    db_embedding_config = db.query(EmbeddingConfigModel).filter(EmbeddingConfigModel.id == embedding_config_id).first()
    if db_embedding_config is None:
        raise HTTPException(status_code=404, detail="Embedding config not found")
    
    for field, value in embedding_config_update.dict(exclude_unset=True).items():
        setattr(db_embedding_config, field, value)
    
    db.commit()
    db.refresh(db_embedding_config)
    return db_embedding_config

@router.delete("/{embedding_config_id}")
def delete_embedding_config(embedding_config_id: int, db: Session = Depends(get_db)):
    """删除嵌入配置"""
    db_embedding_config = db.query(EmbeddingConfigModel).filter(EmbeddingConfigModel.id == embedding_config_id).first()
    if db_embedding_config is None:
        raise HTTPException(status_code=404, detail="Embedding config not found")
    
    db.delete(db_embedding_config)
    db.commit()
    return {"message": "Embedding config deleted successfully"}
