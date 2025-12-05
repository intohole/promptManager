// Embedding测试组件
function EmbeddingTest({ embeddingConfigs }) {
    const [text, setText] = React.useState('');
    const [embeddingConfigId, setEmbeddingConfigId] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !embeddingConfigId) {
            setError('请填写完整的测试信息');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setResult(null);
        
        try {
            const response = await API.LLM.testEmbedding(
                text,
                parseInt(embeddingConfigId)
            );
            setResult(response);
        } catch (err) {
            console.error('Failed to test Embedding:', err);
            setError(`测试失败: ${err.message || '未知错误'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    return React.createElement('div', { className: 'embedding-test-container' },
        React.createElement('h2', null, 'Embedding测试'),
        
        // 错误提示
        error && React.createElement('div', { className: 'error-message' }, error),
        
        // 测试表单
        React.createElement('form', { className: 'test-form', onSubmit: handleSubmit },
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { htmlFor: 'embedding-text' }, '测试文本*'),
                React.createElement('textarea', {
                    id: 'embedding-text',
                    value: text,
                    onChange: (e) => setText(e.target.value),
                    placeholder: '请输入测试用的文本',
                    className: 'form-textarea',
                    rows: 3
                })
            ),
            
            React.createElement('div', { className: 'form-group' },
                React.createElement('label', { htmlFor: 'embedding-config' }, '选择Embedding配置*'),
                React.createElement('select', {
                    id: 'embedding-config',
                    value: embeddingConfigId,
                    onChange: (e) => setEmbeddingConfigId(e.target.value),
                    className: 'form-input'
                },
                    React.createElement('option', { value: '' }, '请选择Embedding配置'),
                    embeddingConfigs.map(config => React.createElement('option', {
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
                React.createElement('label', null, '使用的Embedding配置ID:'),
                React.createElement('span', null, result.embedding_config_id)
            ),
            React.createElement('div', { className: 'result-item' },
                React.createElement('label', null, 'Embedding向量:'),
                React.createElement('div', { className: 'embedding-result' },
                    React.createElement('pre', null, JSON.stringify(result.embedding.slice(0, 20), null, 2)),
                    React.createElement('p', { className: 'embedding-info' },
                        `向量维度: ${result.embedding.length}`
                    )
                )
            )
        )
    );
}
