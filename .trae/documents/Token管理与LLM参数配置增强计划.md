# Token管理与LLM参数配置增强计划

## 需求分析

1. **Input字段增强**：
   - Token编辑缺少API base_url字段
   - 模型类型应改为固定选项（下拉选择）
   - 增加thinking模式选项
   - 增加展示功能

2. **LLM参数配置**：
   - 前后端增加大模型各种参数配置功能
   - 支持灵活的参数管理

## 实现计划

### 1. 后端模型与架构修改

#### 1.1 更新Token模型
```python
# 修改 app/models/token.py
class Token(Base):
    __tablename__ = "tokens"
    
    # 现有字段保持不变
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    value = Column(String, nullable=False)
    model_type = Column(String, index=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # 新增字段
    base_url = Column(String, nullable=True)  # API基础URL
    thinking_mode = Column(Boolean, default=False, nullable=False)  # 是否支持thinking模式
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### 1.2 更新Token Schema
```python
# 修改 app/schemas/token.py
class TokenBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    value: str = Field(..., min_length=1)
    model_type: str = Field(..., min_length=1, max_length=100)
    base_url: Optional[str] = Field(None)
    thinking_mode: bool = False
    is_active: bool = True
```

#### 1.3 创建LLM参数模型
```python
# 新增 app/models/llm_config.py
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
```

#### 1.4 创建LLM参数Schema
```python
# 新增 app/schemas/llm_config.py
class LLMConfigBase(BaseModel):
    model_name: str = Field(..., min_length=1, max_length=255)
    temperature: float = Field(0.1, ge=0.0, le=1.0)
    max_tokens: int = Field(2048, ge=1, le=8192)
    top_p: float = Field(0.9, ge=0.0, le=1.0)
    presence_penalty: float = Field(0.0, ge=-2.0, le=2.0)
    frequency_penalty: float = Field(0.0, ge=-2.0, le=2.0)
    params: Optional[Dict[str, Any]] = None
    is_active: bool = True
```

#### 1.5 新增API端点
- `/api/tokens/` - 保持不变，更新请求/响应模型
- `/api/llm/configs/` - LLM参数配置CRUD
- `/api/llm/configs/token/{token_id}/` - 获取指定Token的LLM配置

### 2. 前端组件更新

#### 2.1 更新TokenList组件
```javascript
// 修改 components/TokenList.js
const [formData, setFormData] = React.useState({
    name: '',
    value: '',
    model_type: '',
    base_url: '',  // 新增
    thinking_mode: false,  // 新增
    is_active: true
});

// 模型类型固定选项
const modelTypes = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'glm', label: 'GLM' },
    { value: 'gemini', label: 'Gemini' }
];
```

#### 2.2 修改模型类型输入为下拉选择
```javascript
// 替换原来的input
React.createElement('select', {
    id: 'token-model-type',
    value: formData.model_type,
    onChange: (e) => setFormData({ ...formData, model_type: e.target.value }),
    className: 'form-input'
},
    modelTypes.map(type => React.createElement('option', {
        key: type.value,
        value: type.value
    }, type.label))
)
```

#### 2.3 新增base_url字段
```javascript
React.createElement('div', { className: 'form-group' },
    React.createElement('label', { htmlFor: 'token-base-url' }, 'API Base URL'),
    React.createElement('input', {
        type: 'text',
        id: 'token-base-url',
        value: formData.base_url,
        onChange: (e) => setFormData({ ...formData, base_url: e.target.value }),
        placeholder: '例如：https://api.openai.com/v1',
        className: 'form-input'
    })
)
```

#### 2.4 新增thinking_mode选项
```javascript
React.createElement('div', { className: 'form-group' },
    React.createElement('label', { htmlFor: 'token-thinking-mode' }, '支持Thinking模式'),
    React.createElement('input', {
        type: 'checkbox',
        id: 'token-thinking-mode',
        checked: formData.thinking_mode,
        onChange: (e) => setFormData({ ...formData, thinking_mode: e.target.checked })
    })
)
```

#### 2.5 新增LLM参数配置组件
```javascript
// 新增 components/LLMConfig.js
function LLMConfig({ tokenId, onRefresh }) {
    // LLM参数配置逻辑
}

// 新增 pages/LLMConfigPage.js
function LLMConfigPage({ tokenId }) {
    // LLM参数配置页面
}
```

### 3. 数据库与迁移

#### 3.1 创建数据库迁移
```bash
# 在backend目录执行
alembic init alembic
alembic revision --autogenerate -m "Update token model and add llm config"
alembic upgrade head
```

#### 3.2 数据库变更
- Token表新增字段：base_url, thinking_mode
- 创建llm_configs表

### 4. 配置与集成

#### 4.1 配置管理更新
- 更新配置服务以支持新的Token字段
- LLM服务集成新的参数配置

#### 4.2 API文档更新
- 自动生成的OpenAPI文档将包含新的字段和端点

## 预期效果

1. **Token管理增强**：
   - ✅ 支持API base_url配置
   - ✅ 模型类型下拉选择
   - ✅ 支持thinking模式
   - ✅ 完整的CRUD功能

2. **LLM参数配置**：
   - ✅ 前后端完整的参数配置功能
   - ✅ 支持多种大模型参数
   - ✅ 灵活的参数管理
   - ✅ 与Token关联的参数配置

## 技术亮点

1. **模块化设计**：新增功能与现有系统无缝集成
2. **灵活的配置**：支持多种大模型和参数
3. **用户体验优化**：直观的界面设计
4. **向后兼容**：不影响现有功能
5. **标准化API**：遵循RESTful设计原则

## 实现顺序

1. 后端模型与Schema更新
2. 数据库迁移
3. API端点开发
4. 前端组件更新
5. LLM配置功能开发
6. 测试与集成
7. 文档更新

## 测试计划

1. **单元测试**：Token和LLMConfig模型测试
2. **API测试**：所有新端点的功能测试
3. **前端测试**：Token编辑和LLM配置界面测试
4. **集成测试**：前后端协同测试
5. **兼容性测试**：与现有功能的兼容测试