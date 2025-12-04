from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..schemas import Prompt, PromptCreate, PromptUpdate
from ..services import PromptService, SearchService

router = APIRouter(prefix="/prompts", tags=["prompts"])
search_service = SearchService()

@router.post("/", response_model=Prompt)
def create_prompt(prompt: PromptCreate, db: Session = Depends(get_db)):
    """创建新Prompt"""
    prompt_service = PromptService(db)
    db_prompt = prompt_service.create_prompt(prompt)
    
    # 添加到搜索索引
    search_service.add_prompt_to_index(db_prompt)
    
    return db_prompt

@router.get("/", response_model=List[Prompt])
def read_prompts(skip: int = 0, limit: int = 100, category: Optional[str] = None, db: Session = Depends(get_db)):
    """获取Prompt列表"""
    prompt_service = PromptService(db)
    return prompt_service.get_prompts(skip=skip, limit=limit, category=category)

@router.get("/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    """获取单个Prompt"""
    prompt_service = PromptService(db)
    db_prompt = prompt_service.get_prompt(prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt

@router.put("/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: int, prompt_update: PromptUpdate, db: Session = Depends(get_db)):
    """更新Prompt"""
    prompt_service = PromptService(db)
    db_prompt = prompt_service.update_prompt(prompt_id, prompt_update)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # 更新搜索索引
    search_service.update_prompt_in_index(db_prompt)
    
    return db_prompt

@router.delete("/{prompt_id}")
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    """删除Prompt"""
    prompt_service = PromptService(db)
    success = prompt_service.delete_prompt(prompt_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    # 从搜索索引中删除
    search_service.delete_prompt_from_index(prompt_id)
    
    return {"message": "Prompt deleted successfully"}

@router.get("/search/{query}")
def search_prompts(query: str, n_results: int = 10, category: Optional[str] = None):
    """搜索Prompt"""
    return search_service.search_prompts(query, n_results=n_results, category=category)
