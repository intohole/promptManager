from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..schemas import LLMConfig, LLMConfigCreate, LLMConfigUpdate
from ..models import LLMConfig as LLMConfigModel

router = APIRouter(prefix="/llm-configs", tags=["llm_configs"])

@router.post("/", response_model=LLMConfig)
def create_llm_config(llm_config: LLMConfigCreate, db: Session = Depends(get_db)):
    """创建LLM配置"""
    db_llm_config = LLMConfigModel(**llm_config.dict())
    db.add(db_llm_config)
    db.commit()
    db.refresh(db_llm_config)
    return db_llm_config

@router.get("/", response_model=List[LLMConfig])
def read_llm_configs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取LLM配置列表"""
    return db.query(LLMConfigModel).offset(skip).limit(limit).all()

@router.get("/{llm_config_id}", response_model=LLMConfig)
def read_llm_config(llm_config_id: int, db: Session = Depends(get_db)):
    """获取单个LLM配置"""
    db_llm_config = db.query(LLMConfigModel).filter(LLMConfigModel.id == llm_config_id).first()
    if db_llm_config is None:
        raise HTTPException(status_code=404, detail="LLM config not found")
    return db_llm_config

@router.get("/token/{token_id}", response_model=List[LLMConfig])
def read_llm_configs_by_token(token_id: int, db: Session = Depends(get_db)):
    """获取指定Token的LLM配置"""
    return db.query(LLMConfigModel).filter(LLMConfigModel.token_id == token_id).all()

@router.put("/{llm_config_id}", response_model=LLMConfig)
def update_llm_config(llm_config_id: int, llm_config_update: LLMConfigUpdate, db: Session = Depends(get_db)):
    """更新LLM配置"""
    db_llm_config = db.query(LLMConfigModel).filter(LLMConfigModel.id == llm_config_id).first()
    if db_llm_config is None:
        raise HTTPException(status_code=404, detail="LLM config not found")
    
    for field, value in llm_config_update.dict(exclude_unset=True).items():
        setattr(db_llm_config, field, value)
    
    db.commit()
    db.refresh(db_llm_config)
    return db_llm_config

@router.delete("/{llm_config_id}")
def delete_llm_config(llm_config_id: int, db: Session = Depends(get_db)):
    """删除LLM配置"""
    db_llm_config = db.query(LLMConfigModel).filter(LLMConfigModel.id == llm_config_id).first()
    if db_llm_config is None:
        raise HTTPException(status_code=404, detail="LLM config not found")
    
    db.delete(db_llm_config)
    db.commit()
    return {"message": "LLM config deleted successfully"}
