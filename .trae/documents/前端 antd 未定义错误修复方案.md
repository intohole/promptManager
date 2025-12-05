# 前端 `antd is not defined` 错误修复方案

## 问题分析

1. **错误信息**：`ReferenceError: antd is not defined` 出现在 `app.js` 第10行
2. **根本原因**：antd 5.x 版本的 CDN 引入方式与旧版本不同，不再默认将 `antd` 作为全局变量暴露
3. **影响范围**：整个前端应用无法正常加载

## 修复方案

### 1. 修复核心问题

**修改 `app.js` 文件**，将直接使用 `antd` 替换为 `window.antd`：

```javascript
// 原代码
const { message } = antd;

// 修复后
const { message } = window.antd;
```

### 2. 检查其他组件

需要检查所有使用 antd 的组件文件，确保它们也使用正确的方式访问 antd：

- `components/PromptList.js`
- `components/VersionList.js`
- `components/TokenList.js`
- `pages/HomePage.js`
- `pages/VersionPage.js`
- `pages/TokenPage.js`

### 3. 替换 antd 组件为原生实现（可选）

为了减少对外部库的依赖，提高应用的稳定性和加载速度，可以考虑将 antd 组件替换为原生 JavaScript 实现：

- 将 `message` 组件替换为原生 `alert` 或自定义弹窗
- 将 UI 组件替换为原生 HTML/CSS 实现

## 修复步骤

1. **修改 `app.js`**：修复 `antd` 未定义问题
2. **检查其他组件文件**：确保所有组件都正确使用 antd
3. **测试修复结果**：访问前端页面，确认应用能正常加载
4. **优化（可选）**：替换 antd 组件为原生实现

## 预期效果

- 前端应用能够正常加载，不再出现 `antd is not defined` 错误
- 所有功能正常工作
- 应用加载速度可能有所提升

## 风险评估

- **低风险**：修复方案简单明确，不会影响核心功能
- **兼容性**：使用 `window.antd` 确保了在 CDN 引入方式下的兼容性
- **可维护性**：修复后代码更清晰，易于维护

## 最佳实践建议

1. **减少外部依赖**：尽可能使用原生 JavaScript 实现，减少对外部库的依赖
2. **明确依赖管理**：对于必须使用的外部库，确保引入方式正确，并在代码中明确访问路径
3. **使用模块系统**：考虑使用 ES 模块或其他模块系统，更好地管理依赖
4. **添加错误处理**：为关键功能添加错误处理，提高应用的鲁棒性