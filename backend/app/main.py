from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.config import engine, Base
from .api import api_router
from .services import SearchService

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 初始化FastAPI应用
app = FastAPI(
    title="Prompt Manager API",
    description="大模型Prompt管理系统API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应替换为具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含API路由
app.include_router(api_router, prefix="/api")

# 初始化搜索服务
search_service = SearchService()

# 根路径
@app.get("/")
def root():
    return {"message": "Prompt Manager API is running"}

# 重建索引的端点（用于管理）
@app.post("/api/rebuild-index")
def rebuild_index():
    """重建搜索索引"""
    search_service.rebuild_index()
    return {"message": "Index rebuilt successfully"}
