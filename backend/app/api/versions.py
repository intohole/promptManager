from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.config import get_db
from ..schemas import Version, VersionCreate, VersionDiff
from ..services import VersionService

router = APIRouter(prefix="/versions", tags=["versions"])

@router.get("/prompt/{prompt_id}", response_model=List[Version])
def get_versions(prompt_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取指定Prompt的所有版本"""
    version_service = VersionService(db)
    return version_service.get_versions(prompt_id, skip=skip, limit=limit)

@router.get("/{version_id}", response_model=Version)
def get_version(version_id: int, db: Session = Depends(get_db)):
    """获取单个版本"""
    version_service = VersionService(db)
    db_version = version_service.get_version(version_id)
    if db_version is None:
        raise HTTPException(status_code=404, detail="Version not found")
    return db_version

@router.get("/prompt/{prompt_id}/number/{version_number}", response_model=Version)
def get_version_by_number(prompt_id: int, version_number: int, db: Session = Depends(get_db)):
    """根据版本号获取版本"""
    version_service = VersionService(db)
    db_version = version_service.get_version_by_number(prompt_id, version_number)
    if db_version is None:
        raise HTTPException(status_code=404, detail="Version not found")
    return db_version

@router.post("/prompt/{prompt_id}", response_model=Version)
def create_version(prompt_id: int, version_create: VersionCreate, db: Session = Depends(get_db)):
    """创建新版本"""
    version_service = VersionService(db)
    db_version = version_service.create_version(prompt_id, version_create)
    if db_version is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_version

@router.get("/diff/prompt/{prompt_id}")
def get_version_diff(prompt_id: int, version1: int, version2: int, db: Session = Depends(get_db)):
    """获取两个版本之间的差异"""
    version_service = VersionService(db)
    diff = version_service.get_version_diff(prompt_id, version1, version2)
    if diff is None:
        raise HTTPException(status_code=404, detail="Version not found")
    return VersionDiff(
        prompt_id=prompt_id,
        version1=version1,
        version2=version2,
        diff=diff
    )

@router.post("/rollback/prompt/{prompt_id}/version/{version_number}")
def rollback_to_version(prompt_id: int, version_number: int, db: Session = Depends(get_db)):
    """回滚到指定版本"""
    version_service = VersionService(db)
    prompt = version_service.rollback_to_version(prompt_id, version_number)
    if prompt is None:
        raise HTTPException(status_code=404, detail="Version or Prompt not found")
    return {"message": f"Rolled back to version {version_number} successfully"}
