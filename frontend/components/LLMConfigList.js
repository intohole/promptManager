// LLM配置列表组件
function LLMConfigList({ llmConfigs, tokens, onRefresh }) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [modalType, setModalType] = React.useState('create'); // create, edit
    const [formData, setFormData] = React.useState({
        token_id: '',
        model_name: '',
        temperature: 0.1,
        max_tokens: 2048,
        top_p: 0.9,
        presence_penalty: 0.0,
        frequency_penalty: 0.0,
        params: {},
        is_active: true
    });
    
    // 处理创建/编辑LLM配置
    const handleSubmit = async () => {
        try {
            if (modalType === 'create') {
                await API.LLMConfig.create(formData);
                alert('LLM配置创建成功');
            } else {
                await API.LLMConfig.update(formData.id, formData);
                alert('LLM配置更新成功');
            }
            setIsModalVisible(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to save LLM config:', error);
            alert(modalType === 'create' ? '创建LLM配置失败: ' + error.message : '更新LLM配置失败: ' + error.message);
        }
    };
    
    // 处理编辑LLM配置
    const handleEditConfig = (config) => {
        setModalType('edit');
        setFormData({
            id: config.id,
            token_id: config.token_id,
            model_name: config.model_name,
            temperature: config.temperature,
            max_tokens: config.max_tokens,
            top_p: config.top_p,
            presence_penalty: config.presence_penalty,
            frequency_penalty: config.frequency_penalty,
            params: config.params || {},
            is_active: config.is_active
        });
        setIsModalVisible(true);
    };
    
    // 处理删除LLM配置
    const handleDeleteConfig = async (configId) => {
        if (window.confirm('确定要删除这个LLM配置吗？')) {
            try {
                await API.LLMConfig.delete(configId);
                alert('LLM配置删除成功');
                onRefresh();
            } catch (error) {
                console.error('Failed to delete LLM config:', error);
                alert('删除LLM配置失败: ' + error.message);
            }
        }
    };
    
    // 处理创建LLM配置
    const handleCreateConfig = () => {
        setModalType('create');
        setFormData({
            token_id: '',
            model_name: '',
            temperature: 0.1,
            max_tokens: 2048,
            top_p: 0.9,
            presence_penalty: 0.0,
            frequency_penalty: 0.0,
            params: {},
            is_active: true
        });
        setIsModalVisible(true);
    };
    
    // 获取token名称
    const getTokenName = (tokenId) => {
        const token = tokens.find(t => t.id === tokenId);
        return token ? token.name : '未知Token';
    };
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement('h2', null, 'LLM配置管理'),
            React.createElement('div', { className: 'header-buttons' },
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: handleCreateConfig
                }, '创建LLM配置'),
                React.createElement('button', {
                    className: 'btn',
                    onClick: onRefresh
                }, '刷新')
            )
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'card-title' }, 'LLM配置列表'),
            React.createElement('div', { className: 'llm-config-list' },
                llmConfigs.length === 0 ? (
                    React.createElement('p', { className: 'empty-state' }, '暂无LLM配置')
                ) : (
                    llmConfigs.map((config) => React.createElement('div', { key: config.id, className: 'llm-config-item' },
                        React.createElement('div', { className: 'llm-config-item-header' },
                            React.createElement('h4', null, `${getTokenName(config.token_id)} - ${config.model_name}`),
                            React.createElement('div', { className: 'llm-config-item-actions' },
                                React.createElement('button', {
                                    className: 'btn btn-small',
                                    onClick: () => handleEditConfig(config)
                                }, '编辑'),
                                React.createElement('button', {
                                    className: 'btn btn-small btn-danger',
                                    onClick: () => handleDeleteConfig(config.id)
                                }, '删除')
                            )
                        ),
                        React.createElement('div', { className: 'llm-config-item-meta' },
                            React.createElement('div', { className: 'llm-config-item-row' },
                                React.createElement('span', { className: 'llm-config-item-label' }, '状态:'),
                                React.createElement('span', { className: `llm-config-item-value ${config.is_active ? 'active' : 'inactive'}` }, config.is_active ? '活跃' : '禁用')
                            ),
                            React.createElement('div', { className: 'llm-config-item-row' },
                                React.createElement('span', { className: 'llm-config-item-label' }, '温度:'),
                                React.createElement('span', { className: 'llm-config-item-value' }, config.temperature)
                            ),
                            React.createElement('div', { className: 'llm-config-item-row' },
                                React.createElement('span', { className: 'llm-config-item-label' }, '最大token数:'),
                                React.createElement('span', { className: 'llm-config-item-value' }, config.max_tokens)
                            ),
                            React.createElement('div', { className: 'llm-config-item-row' },
                                React.createElement('span', { className: 'llm-config-item-label' }, 'Top P:'),
                                React.createElement('span', { className: 'llm-config-item-value' }, config.top_p)
                            ),
                            React.createElement('div', { className: 'llm-config-item-row' },
                                React.createElement('span', { className: 'llm-config-item-label' }, '存在惩罚:'),
                                React.createElement('span', { className: 'llm-config-item-value' }, config.presence_penalty)
                            ),
                            React.createElement('div', { className: 'llm-config-item-row' },
                                React.createElement('span', { className: 'llm-config-item-label' }, '频率惩罚:'),
                                React.createElement('span', { className: 'llm-config-item-value' }, config.frequency_penalty)
                            )
                        )
                    ))
                )
            )
        ),
        
        // LLM配置编辑模态框
        isModalVisible && React.createElement('div', { className: 'modal-overlay' },
            React.createElement('div', { className: 'modal' },
                React.createElement('div', { className: 'modal-header' },
                    React.createElement('h3', null, modalType === 'create' ? '创建LLM配置' : '编辑LLM配置'),
                    React.createElement('button', {
                        className: 'close-btn',
                        onClick: () => setIsModalVisible(false)
                    }, '×')
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('form', { className: 'form' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-token' }, '关联Token*'),
                            React.createElement('select', {
                                id: 'llm-config-token',
                                value: formData.token_id,
                                onChange: (e) => setFormData({ ...formData, token_id: parseInt(e.target.value) }),
                                className: 'form-input'
                            },
                                React.createElement('option', { value: '' }, '请选择Token'),
                                tokens.map(token => React.createElement('option', {
                                    key: token.id,
                                    value: token.id
                                }, `${token.name} (${token.model_type})`))
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-model-name' }, '模型名称*'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'llm-config-model-name',
                                value: formData.model_name,
                                onChange: (e) => setFormData({ ...formData, model_name: e.target.value }),
                                placeholder: '例如：gpt-3.5-turbo',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-temperature' }, '温度'),
                            React.createElement('input', {
                                type: 'number',
                                id: 'llm-config-temperature',
                                value: formData.temperature,
                                onChange: (e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) }),
                                min: 0,
                                max: 2,
                                step: 0.1,
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-max-tokens' }, '最大Token数'),
                            React.createElement('input', {
                                type: 'number',
                                id: 'llm-config-max-tokens',
                                value: formData.max_tokens,
                                onChange: (e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) }),
                                min: 1,
                                max: 32768,
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-top-p' }, 'Top P'),
                            React.createElement('input', {
                                type: 'number',
                                id: 'llm-config-top-p',
                                value: formData.top_p,
                                onChange: (e) => setFormData({ ...formData, top_p: parseFloat(e.target.value) }),
                                min: 0,
                                max: 1,
                                step: 0.1,
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-presence-penalty' }, '存在惩罚'),
                            React.createElement('input', {
                                type: 'number',
                                id: 'llm-config-presence-penalty',
                                value: formData.presence_penalty,
                                onChange: (e) => setFormData({ ...formData, presence_penalty: parseFloat(e.target.value) }),
                                min: -2,
                                max: 2,
                                step: 0.1,
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-frequency-penalty' }, '频率惩罚'),
                            React.createElement('input', {
                                type: 'number',
                                id: 'llm-config-frequency-penalty',
                                value: formData.frequency_penalty,
                                onChange: (e) => setFormData({ ...formData, frequency_penalty: parseFloat(e.target.value) }),
                                min: -2,
                                max: 2,
                                step: 0.1,
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'llm-config-status' }, '状态'),
                            React.createElement('select', {
                                id: 'llm-config-status',
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
