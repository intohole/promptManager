from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Version, Prompt
from ..schemas import VersionCreate
import diff_match_patch as dmp_module

class VersionService:
    def __init__(self, db: Session):
        self.db = db
        self.dmp = dmp_module.diff_match_patch()
    
    def get_versions(self, prompt_id: int, skip: int = 0, limit: int = 100) -> List[Version]:
        """获取指定Prompt的版本列表"""
        return self.db.query(Version).filter(Version.prompt_id == prompt_id).order_by(Version.version_number.desc()).offset(skip).limit(limit).all()
    
    def get_version(self, version_id: int) -> Optional[Version]:
        """获取单个版本"""
        return self.db.query(Version).filter(Version.id == version_id).first()
    
    def get_version_by_number(self, prompt_id: int, version_number: int) -> Optional[Version]:
        """根据版本号获取版本"""
        return self.db.query(Version).filter(Version.prompt_id == prompt_id, Version.version_number == version_number).first()
    
    def create_version(self, prompt_id: int, version_create: VersionCreate) -> Optional[Version]:
        """创建新版本"""
        # 检查Prompt是否存在
        prompt = self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not prompt:
            return None
        
        # 获取当前最大版本号
        max_version = self.db.query(Version).filter(Version.prompt_id == prompt_id).count()
        
        # 生成差异摘要
        if max_version > 0:
            latest_version = self.db.query(Version).filter(Version.prompt_id == prompt_id).order_by(Version.version_number.desc()).first()
            diffs = self.dmp.diff_main(latest_version.content, version_create.content)
            self.dmp.diff_cleanupSemantic(diffs)
            diff_summary = self.dmp.diff_toDelta(diffs)
        else:
            diff_summary = "Initial version"
        
        # 创建新版本
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
        
        # 更新Prompt的当前内容和模型参数
        prompt.content = version_create.content
        prompt.model_params = version_create.model_params
        self.db.commit()
        self.db.refresh(prompt)
        
        return db_version
    
    def get_version_diff(self, prompt_id: int, version1: int, version2: int) -> Optional[str]:
        """获取两个版本之间的差异"""
        # 获取两个版本
        v1 = self.get_version_by_number(prompt_id, version1)
        v2 = self.get_version_by_number(prompt_id, version2)
        
        if not v1 or not v2:
            return None
        
        # 生成差异
        diffs = self.dmp.diff_main(v1.content, v2.content)
        self.dmp.diff_cleanupSemantic(diffs)
        
        # 转换为HTML格式的差异
        diff_html = self.dmp.diff_prettyHtml(diffs)
        
        return diff_html
    
    def rollback_to_version(self, prompt_id: int, version_number: int) -> Optional[Prompt]:
        """回滚到指定版本"""
        # 获取指定版本
        target_version = self.get_version_by_number(prompt_id, version_number)
        if not target_version:
            return None
        
        # 获取当前Prompt
        prompt = self.db.query(Prompt).filter(Prompt.id == prompt_id).first()
        if not prompt:
            return None
        
        # 创建回滚版本
        version_create = VersionCreate(
            content=target_version.content,
            model_params=target_version.model_params,
            comment=f"Rollback to version {version_number}",
            created_by="system"
        )
        
        # 创建新版本
        self.create_version(prompt_id, version_create)
        
        return prompt
