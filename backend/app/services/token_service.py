from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Token
from ..schemas import TokenCreate, TokenUpdate
import bcrypt

class TokenService:
    def __init__(self, db: Session):
        self.db = db
    
    def _hash_token(self, token_value: str) -> str:
        """加密Token值"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(token_value.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def _verify_token(self, hashed_token: str, token_value: str) -> bool:
        """验证Token值"""
        return bcrypt.checkpw(token_value.encode('utf-8'), hashed_token.encode('utf-8'))
    
    def create_token(self, token_create: TokenCreate) -> Token:
        """创建新Token"""
        # 加密Token值
        hashed_value = self._hash_token(token_create.value)
        
        db_token = Token(
            name=token_create.name,
            value=hashed_value,
            model_type=token_create.model_type,
            is_active=token_create.is_active
        )
        
        self.db.add(db_token)
        self.db.commit()
        self.db.refresh(db_token)
        return db_token
    
    def get_tokens(self, skip: int = 0, limit: int = 100, model_type: Optional[str] = None) -> List[Token]:
        """获取Token列表"""
        query = self.db.query(Token)
        if model_type:
            query = query.filter(Token.model_type == model_type)
        return query.offset(skip).limit(limit).all()
    
    def get_token(self, token_id: int) -> Optional[Token]:
        """获取单个Token"""
        return self.db.query(Token).filter(Token.id == token_id).first()
    
    def update_token(self, token_id: int, token_update: TokenUpdate) -> Optional[Token]:
        """更新Token"""
        db_token = self.db.query(Token).filter(Token.id == token_id).first()
        if not db_token:
            return None
        
        update_data = token_update.dict(exclude_unset=True)
        
        # 如果更新了Token值，需要重新加密
        if "value" in update_data:
            update_data["value"] = self._hash_token(update_data["value"])
        
        for field, value in update_data.items():
            setattr(db_token, field, value)
        
        self.db.commit()
        self.db.refresh(db_token)
        return db_token
    
    def delete_token(self, token_id: int) -> bool:
        """删除Token"""
        db_token = self.db.query(Token).filter(Token.id == token_id).first()
        if not db_token:
            return False
        
        self.db.delete(db_token)
        self.db.commit()
        return True
    
    def get_active_tokens(self, model_type: Optional[str] = None) -> List[Token]:
        """获取活跃的Token"""
        query = self.db.query(Token).filter(Token.is_active == True)
        if model_type:
            query = query.filter(Token.model_type == model_type)
        return query.all()
