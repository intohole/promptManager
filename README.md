# Prompt Manager - 大模型Prompt管理系统

## 项目介绍

Prompt Manager是一个用于管理大模型Prompt的系统，支持版本控制、差异对比、Token管理和搜索功能。

## 功能特性

1. **Prompt管理**
   - 创建、编辑、删除Prompt
   - 支持分类和标签
   - 支持Markdown格式

2. **版本控制**
   - 自动保存版本历史
   - 版本之间的差异对比
   - 支持回滚到指定版本
   - 版本备注和标签

3. **Token管理**
   - 大模型API Token的安全存储
   - 支持多个Token配置
   - 支持不同模型类型
   - Token使用状态管理

4. **搜索功能**
   - 基于ChromaDB的向量搜索
   - 支持关键词搜索
   - 支持语义搜索

5. **API接口**
   - RESTful API设计
   - 完整的CRUD操作
   - 版本对比接口
   - 搜索接口

6. **前端页面**
   - 轻量化设计
   - 使用中国CDN资源
   - 响应式设计，支持移动端访问
   - 直观的用户界面

## 技术架构

### 后端
- **框架**: FastAPI
- **数据库**: SQLite3
- **向量数据库**: ChromaDB
- **认证**: 基于API Key
- **语言**: Python 3.12

### 前端
- **框架**: React 18
- **UI组件库**: Ant Design 5
- **编辑器**: CodeMirror 5
- **API请求**: Axios
- **构建工具**: 无（直接使用CDN）

## 目录结构

```
prompt-manager/
├── backend/                # 后端代码
│   ├── app/               # 应用代码
│   │   ├── api/           # API路由
│   │   ├── database/      # 数据库配置
│   │   ├── models/        # 数据库模型
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # 业务逻辑
│   │   └── main.py        # 应用入口
│   ├── requirements.txt   # 依赖列表
│   └── .env.example       # 环境变量示例
├── frontend/              # 前端代码
│   ├── components/        # React组件
│   ├── pages/             # 页面组件
│   ├── services/          # API服务
│   ├── styles/            # 样式文件
│   ├── app.js             # 应用入口
│   └── index.html         # HTML入口
└── README.md              # 项目说明
```

## 快速开始

### 后端部署

1. **安装依赖**
   ```bash
   cd backend
   python3.12 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑.env文件，配置相关参数
   ```

3. **启动服务**
   ```bash
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

4. **访问API文档**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### 前端部署

1. **启动本地HTTP服务器**
   ```bash
   cd frontend
   python -m http.server 3000
   ```

2. **访问前端页面**
   - 前端地址: http://localhost:3000

### ChromaDB部署

1. **启动ChromaDB服务**
   ```bash
   chroma run --port 8999
   ```

## API接口

### Prompt管理
- `GET /api/prompts` - 获取Prompt列表
- `GET /api/prompts/{prompt_id}` - 获取单个Prompt
- `POST /api/prompts` - 创建Prompt
- `PUT /api/prompts/{prompt_id}` - 更新Prompt
- `DELETE /api/prompts/{prompt_id}` - 删除Prompt
- `GET /api/prompts/search/{query}` - 搜索Prompt

### 版本管理
- `GET /api/versions/prompt/{prompt_id}` - 获取版本列表
- `GET /api/versions/{version_id}` - 获取单个版本
- `POST /api/versions/prompt/{prompt_id}` - 创建版本
- `GET /api/versions/diff/prompt/{prompt_id}?version1={v1}&version2={v2}` - 获取版本差异
- `POST /api/versions/rollback/prompt/{prompt_id}/version/{version_number}` - 回滚版本

### Token管理
- `GET /api/tokens` - 获取Token列表
- `GET /api/tokens/{token_id}` - 获取单个Token
- `POST /api/tokens` - 创建Token
- `PUT /api/tokens/{token_id}` - 更新Token
- `DELETE /api/tokens/{token_id}` - 删除Token
- `GET /api/tokens/active/{model_type}` - 获取活跃Token

## 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| DATABASE_URL | 数据库连接字符串 | sqlite:///./prompt_manager.db |
| CHROMA_HOST | ChromaDB主机地址 | localhost |
| CHROMA_PORT | ChromaDB端口 | 8999 |
| OPENAI_API_KEY | OpenAI API Key | 无 |
| OPENAI_API_BASE | OpenAI API地址 | https://api.openai.com/v1 |

## 安全说明

1. **Token存储**
   - Token值使用bcrypt加密存储
   - 不返回原始Token值给前端

2. **API安全**
   - 建议在生产环境中添加API认证
   - 建议使用HTTPS协议

3. **CORS配置**
   - 生产环境中应限制允许的域名

## 性能优化

1. **数据库优化**
   - 合理使用索引
   - 优化查询语句

2. **搜索优化**
   - 使用向量索引加速搜索
   - 限制搜索结果数量

3. **前端优化**
   - 使用CDN加速资源加载
   - 组件懒加载
   - 合理使用缓存

## 开发规范

### 后端
- 遵循PEP 8编码规范
- 使用Type Hints
- 编写单元测试
- 代码注释清晰
- 模块化设计

### 前端
- 组件化开发
- 状态管理清晰
- 代码注释清晰
- 响应式设计
- 性能优化

## 未来规划

1. **功能扩展**
   - 支持更多模型类型
   - 支持Prompt模板
   - 支持批量操作
   - 支持导入导出

2. **性能优化**
   - 支持分布式部署
   - 支持水平扩展
   - 优化搜索性能

3. **安全增强**
   - 支持OAuth 2.0
   - 支持RBAC权限管理
   - 支持审计日志

4. **用户体验**
   - 支持深色模式
   - 支持快捷键
   - 支持拖拽排序

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目地址: https://github.com/yourusername/prompt-manager
- 邮箱: your.email@example.com
