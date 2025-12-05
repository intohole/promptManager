from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from ..database.config import Base

class LLMConfig(Base):
    __tablename__ = "llm_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    model_name = Column(String, index=True, nullable=False)
    temperature = Column(Float, default=0.1, nullable=False)
    max_tokens = Column(Integer, default=2048, nullable=False)
    top_p = Column(Float, default=0.9, nullable=False)
    presence_penalty = Column(Float, default=0.0, nullable=False)
    frequency_penalty = Column(Float, default=0.0, nullable=False)
    # 其他LLM参数
    params = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
