from fastapi import APIRouter
from .prompts import router as prompts_router
from .versions import router as versions_router
from .tokens import router as tokens_router
from .configs import router as configs_router
from .llm import router as llm_router
from .llm_configs import router as llm_configs_router
from .embedding_configs import router as embedding_configs_router

api_router = APIRouter()

# 包含所有子路由
api_router.include_router(prompts_router)
api_router.include_router(versions_router)
api_router.include_router(tokens_router)
api_router.include_router(configs_router)
api_router.include_router(llm_router)
api_router.include_router(llm_configs_router)
api_router.include_router(embedding_configs_router)
