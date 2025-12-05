## 开发计划

### 1. 前端开发

**1.1 修改LLMTest组件**

* 在LLMTest组件中添加选择已有Prompt的功能
* 保留手动输入Prompt的选项
* 实现选择Prompt后自动填充到文本框的功能

**1.2 组件结构设计**

* 添加一个新的select元素，用于选择已有Prompt
* 保留现有的textarea元素，用于手动输入或编辑Prompt
* 实现选择Prompt后自动填充到textarea的逻辑

**1.3 组件状态管理**

* 添加一个新的状态变量`selectedPromptId`，用于跟踪选中的Prompt ID
* 更新handleSubmit函数，确保使用当前textarea的值进行测试

**1.4 组件交互设计**

* 当用户从下拉菜单选择Prompt时，自动填充textarea
* 用户可以在填充后进一步编辑textarea中的内容
* 提供"清空"选项，允许用户清除当前选择

### 2. 集成测试

**2.1 测试组件功能**

* 测试选择Prompt的功能是否正常工作
* 测试手动输入Prompt的功能是否正常工作
* 测试选择后编辑Prompt的功能是否正常工作

**2.2 测试API调用**

* 测试选择Prompt后调用API的功能
* 测试手动输入Prompt后调用API的功能

### 3. 预期修改的文件

**前端文件**：

* `frontend/components/LLMTest.js`：修改LLM测试组件，添加选择Prompt的功能

## 开发顺序

1. 修改LLMTest组件，添加选择Prompt的功能
2. 实现选择Prompt后自动填充到textarea的逻辑
3. 测试组件功能
4. 测试API调用功能

## 预期结果

* LLM测试页面将显示一个Prompt选择下拉菜单
* 用户可以选择已有Prompt或手动输入
* 选择Prompt后，textarea将自动填充该Prompt的内容
* 用户可以在填充后进一步编辑
* 测试功能将使用当前textarea的内容进行API调用

## 注意事项

* 确保组件在没有任何Prompt时仍能正常工作
* 确保组件在选择Prompt后仍允许手动编辑
* 确保API调用使用的是最新的textarea内容
* 保持组件的易用性和直观性