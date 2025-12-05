// Token列表组件
function TokenList({ tokens, onRefresh }) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [modalType, setModalType] = React.useState('create'); // create, edit
    const [formData, setFormData] = React.useState({
        name: '',
        value: '',
        model_type: 'openai',
        base_url: '',
        thinking_mode: false,
        is_active: true
    });
    
    // 模型类型固定选项
    const modelTypes = [
        { value: 'openai', label: 'OpenAI' },
        { value: 'anthropic', label: 'Anthropic' },
        { value: 'glm', label: 'GLM' },
        { value: 'gemini', label: 'Gemini' }
    ];
    
    // 处理创建/编辑Token
    const handleSubmit = async () => {
        try {
            if (modalType === 'create') {
                await API.Token.create(formData);
                alert('Token创建成功');
            } else {
                await API.Token.update(formData.id, formData);
                alert('Token更新成功');
            }
            setIsModalVisible(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to save token:', error);
            alert(modalType === 'create' ? '创建Token失败: ' + error.message : '更新Token失败: ' + error.message);
        }
    };
    
    // 处理编辑Token
    const handleEditToken = (token) => {
        setModalType('edit');
        setFormData(token);
        setIsModalVisible(true);
    };
    
    // 处理删除Token
    const handleDeleteToken = async (tokenId) => {
        if (window.confirm('确定要删除这个Token吗？')) {
            try {
                await API.Token.delete(tokenId);
                alert('Token删除成功');
                onRefresh();
            } catch (error) {
                console.error('Failed to delete token:', error);
                alert('删除Token失败: ' + error.message);
            }
        }
    };
    
    // 处理创建Token
    const handleCreateToken = () => {
        setModalType('create');
        setFormData({
            name: '',
            value: '',
            model_type: 'openai',
            base_url: '',
            thinking_mode: false,
            is_active: true
        });
        setIsModalVisible(true);
    };
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement('h2', null, 'Token管理'),
            React.createElement('div', { className: 'header-buttons' },
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: handleCreateToken
                }, '创建Token'),
                React.createElement('button', {
                    className: 'btn',
                    onClick: onRefresh
                }, '刷新')
            )
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'card-title' }, 'Token列表'),
            React.createElement('div', { className: 'token-list' },
                tokens.map((token) => React.createElement('div', { key: token.id, className: 'token-item' },
                    React.createElement('div', { className: 'token-item-header' },
                        React.createElement('h4', null, token.name),
                        React.createElement('div', { className: 'token-item-actions' },
                            React.createElement('button', {
                                className: 'btn btn-small',
                                onClick: () => handleEditToken(token)
                            }, '编辑'),
                            React.createElement('button', {
                                className: 'btn btn-small btn-danger',
                                onClick: () => handleDeleteToken(token.id)
                            }, '删除')
                        )
                    ),
                    React.createElement('div', { className: 'token-item-meta' },
                        React.createElement('p', null, `模型类型: ${token.model_type}`),
                        React.createElement('p', null, `API Base URL: ${token.base_url || '未设置'}`),
                        React.createElement('p', null, `Thinking模式: ${token.thinking_mode ? '支持' : '不支持'}`),
                        React.createElement('p', null, `状态: ${token.is_active ? '活跃' : '禁用'}`),
                        React.createElement('p', null, `创建时间: ${new Date(token.created_at).toLocaleString()}`)
                    )
                ))
            )
        ),
        
        // Token编辑模态框
        isModalVisible && React.createElement('div', { className: 'modal-overlay' },
            React.createElement('div', { className: 'modal' },
                React.createElement('div', { className: 'modal-header' },
                    React.createElement('h3', null, modalType === 'create' ? '创建Token' : '编辑Token'),
                    React.createElement('button', {
                        className: 'close-btn',
                        onClick: () => setIsModalVisible(false)
                    }, '×')
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('form', { className: 'form' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'token-name' }, '名称*'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'token-name',
                                value: formData.name,
                                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                                placeholder: '请输入Token名称',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'token-value' }, 'API Key*'),
                            React.createElement('input', {
                                type: 'password',
                                id: 'token-value',
                                value: formData.value,
                                onChange: (e) => setFormData({ ...formData, value: e.target.value }),
                                placeholder: '请输入API Key',
                                className: 'form-input'
                            })
                        ),
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
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'token-model-type' }, '模型类型*'),
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
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, '支持Thinking模式'),
                            React.createElement('div', { className: 'checkbox-group' },
                                React.createElement('input', {
                                    type: 'checkbox',
                                    id: 'token-thinking-mode',
                                    checked: formData.thinking_mode,
                                    onChange: (e) => setFormData({ ...formData, thinking_mode: e.target.checked })
                                }),
                                React.createElement('label', { htmlFor: 'token-thinking-mode' }, '启用Thinking模式')
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'token-status' }, '状态'),
                            React.createElement('select', {
                                id: 'token-status',
                                value: formData.is_active,
                                onChange: (e) => setFormData({ ...formData, is_active: e.target.value === 'true' }),
                                className: 'form-input'
                            },
                                React.createElement('option', { value: 'true' }, '活跃'),
                                React.createElement('option', { value: 'false' }, '禁用')
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'modal-footer' },
                    React.createElement('button', {
                        className: 'btn',
                        onClick: () => setIsModalVisible(false)
                    }, '取消'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: handleSubmit
                    }, '确定')
                )
            )
        )
    );
}