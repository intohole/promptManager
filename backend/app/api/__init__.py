from fastapi import APIRouter
from .prompts import router as prompts_router
from .versions import router as versions_router
from .tokens import router as tokens_router

api_router = APIRouter()

# 包含所有子路由
api_router.include_router(prompts_router)
api_router.include_router(versions_router)
api_router.include_router(tokens_router)
