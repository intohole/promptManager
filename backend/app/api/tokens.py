from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..schemas import Token, TokenCreate, TokenUpdate
from ..services import TokenService

router = APIRouter(prefix="/tokens", tags=["tokens"])

@router.post("/", response_model=Token)
def create_token(token_create: TokenCreate, db: Session = Depends(get_db)):
    """创建新Token"""
    token_service = TokenService(db)
    return token_service.create_token(token_create)

@router.get("/", response_model=List[Token])
def read_tokens(skip: int = 0, limit: int = 100, model_type: Optional[str] = None, db: Session = Depends(get_db)):
    """获取Token列表"""
    token_service = TokenService(db)
    return token_service.get_tokens(skip=skip, limit=limit, model_type=model_type)

@router.get("/{token_id}", response_model=Token)
def read_token(token_id: int, db: Session = Depends(get_db)):
    """获取单个Token"""
    token_service = TokenService(db)
    db_token = token_service.get_token(token_id)
    if db_token is None:
        raise HTTPException(status_code=404, detail="Token not found")
    return db_token

@router.put("/{token_id}", response_model=Token)
def update_token(token_id: int, token_update: TokenUpdate, db: Session = Depends(get_db)):
    """更新Token"""
    token_service = TokenService(db)
    db_token = token_service.update_token(token_id, token_update)
    if db_token is None:
        raise HTTPException(status_code=404, detail="Token not found")
    return db_token

@router.delete("/{token_id}")
def delete_token(token_id: int, db: Session = Depends(get_db)):
    """删除Token"""
    token_service = TokenService(db)
    success = token_service.delete_token(token_id)
    if not success:
        raise HTTPException(status_code=404, detail="Token not found")
    return {"message": "Token deleted successfully"}

@router.get("/active/{model_type}", response_model=List[Token])
def get_active_tokens(model_type: str, db: Session = Depends(get_db)):
    """获取活跃的Token"""
    token_service = TokenService(db)
    return token_service.get_active_tokens(model_type=model_type)
