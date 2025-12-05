from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from ..database.config import Base

class Token(Base):
    __tablename__ = "tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    value = Column(String, nullable=False)
    model_type = Column(String, index=True, nullable=False)
    base_url = Column(String, nullable=True)  # API基础URL
    thinking_mode = Column(Boolean, default=False, nullable=False)  # 是否支持thinking模式
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
