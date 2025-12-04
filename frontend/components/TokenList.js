// Token列表组件
function TokenList({ tokens, onRefresh }) {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [modalType, setModalType] = React.useState('create'); // create, edit
    const [formData, setFormData] = React.useState({
        name: '',
        value: '',
        model_type: '',
        is_active: true
    });
    
    const { message } = antd;
    
    // 处理创建/编辑Token
    const handleSubmit = async () => {
        try {
            if (modalType === 'create') {
                await API.Token.create(formData);
                message.success('Token创建成功');
            } else {
                await API.Token.update(formData.id, formData);
                message.success('Token更新成功');
            }
            setIsModalVisible(false);
            onRefresh();
        } catch (error) {
            console.error('Failed to save token:', error);
            message.error(modalType === 'create' ? '创建Token失败' : '更新Token失败');
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
                message.success('Token删除成功');
                onRefresh();
            } catch (error) {
                console.error('Failed to delete token:', error);
                message.error('删除Token失败');
            }
        }
    };
    
    // 处理创建Token
    const handleCreateToken = () => {
        setModalType('create');
        setFormData({
            name: '',
            value: '',
            model_type: '',
            is_active: true
        });
        setIsModalVisible(true);
    };
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement(antd.Space, null,
                React.createElement('h2', null, 'Token管理'),
                React.createElement(antd.Button, {
                    type: 'primary',
                    onClick: handleCreateToken
                }, '创建Token'),
                React.createElement(antd.Button, { onClick: onRefresh }, '刷新')
            )
        ),
        
        React.createElement(antd.Card, { title: 'Token列表' },
            React.createElement(antd.List, {
                dataSource: tokens,
                renderItem: (token) => React.createElement(antd.List.Item, {
                    actions: [
                        React.createElement(antd.Button, {
                            size: 'small',
                            onClick: () => handleEditToken(token)
                        }, '编辑'),
                        React.createElement(antd.Button, {
                            size: 'small',
                            danger: true,
                            onClick: () => handleDeleteToken(token.id)
                        }, '删除')
                    ]
                },
                    React.createElement(antd.List.Item.Meta, {
                        title: token.name,
                        description: React.createElement('div', null,
                            React.createElement('p', null, `模型类型: ${token.model_type}`),
                            React.createElement('p', null, `状态: ${token.is_active ? '活跃' : '禁用'}`),
                            React.createElement('p', null, `创建时间: ${new Date(token.created_at).toLocaleString()}`)
                        )
                    })
                )
            })
        ),
        
        // Token编辑模态框
        React.createElement(antd.Modal, {
            title: modalType === 'create' ? '创建Token' : '编辑Token',
            open: isModalVisible,
            onOk: handleSubmit,
            onCancel: () => setIsModalVisible(false)
        },
            React.createElement(antd.Form, { layout: 'vertical' },
                React.createElement(antd.Form.Item, { label: '名称', required: true },
                    React.createElement(antd.Input, {
                        value: formData.name,
                        onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                        placeholder: '请输入Token名称'
                    })
                ),
                React.createElement(antd.Form.Item, { label: 'API Key', required: true },
                    React.createElement(antd.Input.Password, {
                        value: formData.value,
                        onChange: (e) => setFormData({ ...formData, value: e.target.value }),
                        placeholder: '请输入API Key'
                    })
                ),
                React.createElement(antd.Form.Item, { label: '模型类型', required: true },
                    React.createElement(antd.Input, {
                        value: formData.model_type,
                        onChange: (e) => setFormData({ ...formData, model_type: e.target.value }),
                        placeholder: '请输入模型类型（如：openai, anthropic等）'
                    })
                ),
                React.createElement(antd.Form.Item, { label: '状态' },
                    React.createElement(antd.Select, {
                        value: formData.is_active,
                        onChange: (value) => setFormData({ ...formData, is_active: value })
                    },
                        React.createElement(antd.Select.Option, { value: true }, '活跃'),
                        React.createElement(antd.Select.Option, { value: false }, '禁用')
                    )
                )
            )
        )
    );
}
