// LLM测试组件
function LLMTest({ llmConfigs, prompts }) {
    const [prompt, setPrompt] = React.useState('');
    const [selectedPromptId, setSelectedPromptId] = React.useState('');
    const [llmConfigId, setLLMConfigId] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    // 处理Prompt选择变化
    const handlePromptSelect = (e) => {
        const promptId = e.target.value;
        setSelectedPromptId(promptId);
        
        if (promptId) {
            const selectedPrompt = prompts.find(p => p.id === parseInt(promptId));
            if (selectedPrompt) {
                setPrompt(selectedPrompt.content);
            }
        } else {
            setPrompt('');
        }
    };
    
    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt || !llmConfigId) {
            setError('请填写完整的测试信息');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setResult(null);
        
        try {
            const response = await API.LLM.testGenerate(
                prompt,
                parseInt(llmConfigId)
            );
            setResult(response);
        } catch (err) {
            console.error('Failed to test LLM:', err);
            setError(`测试失败: ${err.message || '未知错误'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return React.createElement('div', { className: 'llm-test-container' },
        React.createElement('h2', null, 'LLM测试'),
        
        // 错误提示
        error && React.createElement('div', { className: 'error-message' }, error),
        
        // 测试表单
        React.createElement('form', { className: 'test-form', onSubmit: handleSubmit },
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { htmlFor: 'llm-prompt-select' }, '选择已有Prompt'),
                React.createElement('select', {
                    id: 'llm-prompt-select',
                    value: selectedPromptId,
                    onChange: handlePromptSelect,
                    className: 'form-input'
                },
                    React.createElement('option', { value: '' }, '请选择Prompt（可选）'),
                    prompts.map(prompt => React.createElement('option', {
                        key: prompt.id,
                        value: prompt.id
                    }, `${prompt.name} (${prompt.category || '未分类'})`))
                )
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { htmlFor: 'llm-prompt' }, '测试Prompt*'),
                React.createElement('textarea', {
                    id: 'llm-prompt',
                    value: prompt,
                    onChange: (e) => setPrompt(e.target.value),
                    placeholder: '请输入测试用的Prompt，或选择已有Prompt后修改',
                    className: 'form-textarea',
                    rows: 5
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { htmlFor: 'llm-config' }, '选择LLM配置*'),
                React.createElement('select', {
                    id: 'llm-config',
                    value: llmConfigId,
                    onChange: (e) => setLLMConfigId(e.target.value),
                    className: 'form-input'
                },
                    React.createElement('option', { value: '' }, '请选择LLM配置'),
                    llmConfigs.map(config => React.createElement('option', {
                        key: config.id,
                        value: config.id
                    }, `${config.name} (${config.model_name})`))
                )
            ),
            
            React.createElement('div', { className: 'form-actions' },
                React.createElement('button', {
                    type: 'submit',
                    className: `btn btn-primary ${isLoading ? 'btn-loading' : ''}`,
                    disabled: isLoading
                }, isLoading ? '测试中...' : '开始测试')
            )
        ),
        
        // 测试结果
        result && React.createElement('div', { className: 'test-result' },
            React.createElement('h3', null, '测试结果'),
            React.createElement('div', { className: 'result-item' },
                React.createElement('label', null, '使用的LLM配置ID:'),
                React.createElement('span', null, result.llm_config_id)
            ),
            React.createElement('div', { className: 'result-item' },
                React.createElement('label', null, '生成结果:'),
                React.createElement('div', { className: 'result-content' }, result.completion)
            )
        )
    );
}
