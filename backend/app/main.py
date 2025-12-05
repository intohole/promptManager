from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles as FastAPIStaticFiles
from fastapi.responses import FileResponse
import os
from .database.config import engine, Base
from .api import api_router
# from .services import SearchService  # 暂时注释，待解决chromadb连接问题

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

# 前端静态文件服务
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend")

# 直接处理所有API路由
app.include_router(api_router, prefix="/api")

# 处理静态资源文件，使用正确的路径组合
@app.get("/styles/{file_path:path}")
def serve_style(file_path: str):
    file_path = file_path.strip("/")
    full_path = os.path.join(frontend_dir, "styles", file_path)
    return FileResponse(full_path)

@app.get("/services/{file_path:path}")
def serve_service(file_path: str):
    file_path = file_path.strip("/")
    full_path = os.path.join(frontend_dir, "services", file_path)
    return FileResponse(full_path)

@app.get("/components/{file_path:path}")
def serve_component(file_path: str):
    file_path = file_path.strip("/")
    full_path = os.path.join(frontend_dir, "components", file_path)
    return FileResponse(full_path)

@app.get("/pages/{file_path:path}")
def serve_page(file_path: str):
    file_path = file_path.strip("/")
    full_path = os.path.join(frontend_dir, "pages", file_path)
    return FileResponse(full_path)

@app.get("/app.js")
def serve_app_js():
    full_path = os.path.join(frontend_dir, "app.js")
    return FileResponse(full_path)

# 处理前端路由
@app.get("/")
def root():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/prompts")
def prompts_page():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/tokens")
def tokens_page():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/llm-configs")
def llm_configs_page():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

@app.get("/versions")
def versions_page():
    return FileResponse(os.path.join(frontend_dir, "index.html"))

# 初始化搜索服务
# search_service = SearchService()  # 暂时注释，待解决chromadb连接问题

# 重建索引的端点（用于管理）
@app.post("/api/rebuild-index")
def rebuild_index():
    """重建搜索索引"""
    # search_service.rebuild_index()  # 暂时注释，待解决chromadb连接问题
    return {"message": "Index rebuild functionality is temporarily disabled"}
