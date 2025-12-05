from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from ..database.config import Base

class EmbeddingConfig(Base):
    __tablename__ = "embedding_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    model_name = Column(String, index=True, nullable=False)
    # 通用嵌入模型参数，使用JSON格式存储，适应不同嵌入服务提供商的不同参数需求
    params = Column(JSON, nullable=False, default={})
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
