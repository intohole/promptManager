// Embedding配置列表组件
function EmbeddingConfigList({ embeddingConfigs, tokens, onRefresh }) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [modalType, setModalType] = React.useState('create'); // create, edit
    const [formData, setFormData] = React.useState({
        name: '',
        token_id: '',
        model_name: '',
        params: {},
        is_active: true
    });
    
    // 处理创建/编辑Embedding配置
    const handleSubmit = async () => {
        try {
            // 将表单数据转换为API所需格式
            const submitData = {
                name: formData.name,
                token_id: formData.token_id,
                model_name: formData.model_name,
                params: formData.params,
                is_active: formData.is_active
            };
            
            if (modalType === 'create') {
                await API.EmbeddingConfig.create(submitData);
                alert('Embedding配置创建成功');
            } else {
                await API.EmbeddingConfig.update(formData.id, submitData);
                alert('Embedding配置更新成功');
            }
            setIsModalVisible(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to save Embedding config:', error);
            alert(modalType === 'create' ? '创建Embedding配置失败: ' + error.message : '更新Embedding配置失败: ' + error.message);
        }
    };
    
    // 处理编辑Embedding配置
    const handleEditConfig = (config) => {
        setModalType('edit');
        setFormData({
            id: config.id,
            name: config.name,
            token_id: config.token_id,
            model_name: config.model_name,
            params: config.params || {},
            is_active: config.is_active
        });
        setIsModalVisible(true);
    };
    
    // 处理删除Embedding配置
    const handleDeleteConfig = async (configId) => {
        if (window.confirm('确定要删除这个Embedding配置吗？')) {
            try {
                await API.EmbeddingConfig.delete(configId);
                alert('Embedding配置删除成功');
                onRefresh();
            } catch (error) {
                console.error('Failed to delete Embedding config:', error);
                alert('删除Embedding配置失败: ' + error.message);
            }
        }
    };
    
    // 处理创建Embedding配置
    const handleCreateConfig = () => {
        setModalType('create');
        setFormData({
            name: '',
            token_id: '',
            model_name: '',
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
            React.createElement('h2', null, 'Embedding配置管理'),
            React.createElement('div', { className: 'header-buttons' },
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: handleCreateConfig
                }, '创建Embedding配置'),
                React.createElement('button', {
                    className: 'btn',
                    onClick: onRefresh
                }, '刷新')
            )
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'card-title' }, 'Embedding配置列表'),
            React.createElement('div', { className: 'embedding-config-list' },
                embeddingConfigs.length === 0 ? (
                    React.createElement('p', { className: 'empty-state' }, '暂无Embedding配置')
                ) : (
                    embeddingConfigs.map((config) => React.createElement('div', { key: config.id, className: 'embedding-config-item' },
                        React.createElement('div', { className: 'embedding-config-item-header' },
                            React.createElement('h4', null, `${config.name} (${getTokenName(config.token_id)} - ${config.model_name})`),
                            React.createElement('div', { className: 'embedding-config-item-actions' },
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
                        React.createElement('div', { className: 'embedding-config-item-meta' },
                            React.createElement('div', { className: 'embedding-config-item-row' },
                                React.createElement('span', { className: 'embedding-config-item-label' }, '状态:'),
                                React.createElement('span', { className: `embedding-config-item-value ${config.is_active ? 'active' : 'inactive'}` }, config.is_active ? '活跃' : '禁用')
                            ),
                            React.createElement('div', { className: 'embedding-config-item-row' },
                                React.createElement('span', { className: 'embedding-config-item-label' }, '模型参数:'),
                                React.createElement('pre', { className: 'embedding-config-item-value' }, JSON.stringify(config.params, null, 2))
                            )
                        )
                    ))
                )
            )
        ),
        
        // Embedding配置编辑模态框
        isModalVisible && React.createElement('div', { className: 'modal-overlay' },
            React.createElement('div', { className: 'modal' },
                React.createElement('div', { className: 'modal-header' },
                    React.createElement('h3', null, modalType === 'create' ? '创建Embedding配置' : '编辑Embedding配置'),
                    React.createElement('button', {
                        className: 'close-btn',
                        onClick: () => setIsModalVisible(false)
                    }, '×')
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('form', { className: 'form' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'embedding-config-token' }, '关联Token*'),
                            React.createElement('select', {
                                id: 'embedding-config-token',
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
                            React.createElement('label', { htmlFor: 'embedding-config-name' }, '配置名称*'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'embedding-config-name',
                                value: formData.name,
                                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                                placeholder: '例如：text-embedding-ada-002默认配置',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'embedding-config-model-name' }, '模型名称*'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'embedding-config-model-name',
                                value: formData.model_name,
                                onChange: (e) => setFormData({ ...formData, model_name: e.target.value }),
                                placeholder: '例如：text-embedding-ada-002',
                                className: 'form-input'
                            })
                        ),
                        // 可视化模型参数配置
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('h4', null, '模型参数配置'),
                            React.createElement('div', { className: 'param-group' },
                                React.createElement('label', { htmlFor: 'embedding-config-dimensions' }, '向量维度'),
                                React.createElement('input', {
                                    type: 'number',
                                    id: 'embedding-config-dimensions',
                                    value: formData.params.dimensions || 1536,
                                    onChange: (e) => setFormData({ 
                                        ...formData, 
                                        params: { 
                                            ...formData.params, 
                                            dimensions: parseInt(e.target.value) 
                                        } 
                                    }),
                                    min: 1,
                                    max: 4096,
                                    step: 100,
                                    className: 'form-input'
                                })
                            ),
                            React.createElement('div', { className: 'param-group' },
                                React.createElement('label', { htmlFor: 'embedding-config-normalize' }, '是否归一化'),
                                React.createElement('select', {
                                    id: 'embedding-config-normalize',
                                    value: formData.params.normalize || false,
                                    onChange: (e) => setFormData({ 
                                        ...formData, 
                                        params: { 
                                            ...formData.params, 
                                            normalize: e.target.value === 'true' 
                                        } 
                                    }),
                                    className: 'form-input'
                                },
                                    React.createElement('option', { value: 'false' }, '否'),
                                    React.createElement('option', { value: 'true' }, '是')
                                )
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'embedding-config-status' }, '状态'),
                            React.createElement('select', {
                                id: 'embedding-config-status',
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
