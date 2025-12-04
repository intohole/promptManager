from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from ..models import Prompt, Version
from ..schemas import PromptCreate, PromptUpdate, VersionCreate
import diff_match_patch as dmp_module

class PromptService:
    def __init__(self, db: Session):
        self.db = db
        self.dmp = dmp_module.diff_match_patch()
    
    def create_prompt(self, prompt: PromptCreate) -> Prompt:
        """创建新的Prompt并保存初始版本"""
        db_prompt = Prompt(**prompt.dict())
        self.db.add(db_prompt)
        self.db.commit()
        self.db.refresh(db_prompt)
        
        # 创建初始版本
        version_create = VersionCreate(
            content=prompt.content,
            model_params=prompt.model_params,
            comment="Initial version",
            created_by="system"
        )
        self._create_version(db_prompt.id, version_create)
        
        return db_prompt
    
    def get_prompts(self, skip: int = 0, limit: int = 100, category: Optional[str] = None) -> List[Prompt]:
        """获取Prompt列表"""
        query = self.db.query(Prompt)
        if category:
            query = query.filter(Prompt.category == category)
        return query.offset(skip).limit(limit).all()
    
    def get_prompt(self, prompt_id: int) -> Optional[Prompt]:
        """获取单个Prompt"""
        return self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
    
    def update_prompt(self, prompt_id: int, prompt_update: PromptUpdate) -> Optional[Prompt]:
        """更新Prompt并创建新版本"""
        db_prompt = self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not db_prompt:
            return None
        
        # 准备更新数据
        update_data = prompt_update.dict(exclude_unset=True)
        if not update_data:
            return db_prompt
        
        # 检查内容或模型参数是否变化
        content_changed = False
        params_changed = False
        
        if "content" in update_data:
            content_changed = db_prompt.content != update_data["content"]
        
        if "model_params" in update_data:
            params_changed = db_prompt.model_params != update_data["model_params"]
        
        # 只有当内容或模型参数变化时才创建新版本
        if content_changed or params_changed:
            # 准备新版本数据
            version_content = update_data.get("content", db_prompt.content)
            version_params = update_data.get("model_params", db_prompt.model_params)
            
            # 生成差异摘要
            diffs = self.dmp.diff_main(db_prompt.content, version_content)
            self.dmp.diff_cleanupSemantic(diffs)
            diff_summary = self.dmp.diff_toDelta(diffs)
            
            # 创建新版本
            version_create = VersionCreate(
                content=version_content,
                model_params=version_params,
                comment="Auto-save on update",
                created_by="system"
            )
            self._create_version(prompt_id, version_create, diff_summary)
        
        # 更新Prompt
        for field, value in update_data.items():
            setattr(db_prompt, field, value)
        
        self.db.commit()
        self.db.refresh(db_prompt)
        return db_prompt
    
    def delete_prompt(self, prompt_id: int) -> bool:
        """删除Prompt"""
        db_prompt = self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not db_prompt:
            return False
        
        self.db.delete(db_prompt)
        self.db.commit()
        return True
    
    def _create_version(self, prompt_id: int, version_create: VersionCreate, diff_summary: Optional[str] = None) -> Version:
        """创建版本"""
        # 获取当前最大版本号
        max_version = self.db.query(Version).filter(Version.prompt_id == prompt_id).count()
        
        db_version = Version(
            prompt_id=prompt_id,
            version_number=max_version + 1,
            content=version_create.content,
            model_params=version_create.model_params,
            diff_summary=diff_summary,
            created_by=version_create.created_by or "system",
            comment=version_create.comment
        )
        
        self.db.add(db_version)
        self.db.commit()
        self.db.refresh(db_version)
        return db_version
