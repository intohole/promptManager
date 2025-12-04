// Prompt列表组件
function PromptList({ 
    prompts, 
    onSelectPrompt, 
    onEditPrompt, 
    onDeletePrompt, 
    onSearch, 
    searchQuery, 
    setSearchQuery 
}) {
    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        content: '',
        category: '',
        tags: [],
        tagInput: '',
        model_params: {}
    });
    
    const { message } = antd;
    
    // 处理创建Prompt
    const handleCreatePrompt = async () => {
        try {
            await API.Prompt.create({
                ...formData,
                model_params: formData.model_params || {}
            });
            message.success('Prompt创建成功');
            setIsCreateModalVisible(false);
            // 刷新父组件的Prompts列表
            window.location.reload();
        } catch (error) {
            console.error('Failed to create prompt:', error);
            message.error('创建Prompt失败');
        }
    };
    
    // 处理标签输入
    const handleTagInput = (e) => {
        setFormData({ ...formData, tagInput: e.target.value });
    };
    
    // 处理添加标签
    const handleAddTag = () => {
        if (formData.tagInput && !formData.tags.includes(formData.tagInput)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, formData.tagInput],
                tagInput: ''
            });
        }
    };
    
    // 处理删除标签
    const handleRemoveTag = (tag) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(t => t !== tag)
        });
    };
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement('h2', null, 'Prompt列表'),
            React.createElement(antd.Space, null,
                React.createElement(antd.Input, {
                    placeholder: '搜索Prompt',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    onPressEnter: onSearch,
                    style: { width: 300 }
                }),
                React.createElement(antd.Button, { type: 'primary', onClick: onSearch }, '搜索'),
                React.createElement(antd.Button, { 
                    type: 'primary', 
                    onClick: () => setIsCreateModalVisible(true) 
                }, '创建Prompt')
            )
        ),
        
        React.createElement('div', { style: { marginTop: 20 } },
            React.createElement(antd.List, {
                grid: { gutter: 16, column: 3 },
                dataSource: prompts,
                renderItem: (prompt) => React.createElement(antd.List.Item, null,
                    React.createElement(antd.Card, {
                        title: prompt.name,
                        extra: React.createElement(antd.Space, null,
                            React.createElement(antd.Button, {
                                size: 'small',
                                onClick: () => onSelectPrompt(prompt)
                            }, '版本'),
                            React.createElement(antd.Button, {
                                size: 'small',
                                onClick: () => onEditPrompt(prompt)
                            }, '编辑'),
                            React.createElement(antd.Button, {
                                size: 'small',
                                danger: true,
                                onClick: () => onDeletePrompt(prompt.id)
                            }, '删除')
                        )
                    },
                        React.createElement('p', null, prompt.description || '无描述'),
                        React.createElement('div', { style: { marginTop: 10 } },
                            prompt.tags && prompt.tags.map(tag => React.createElement(antd.Tag, { key: tag }, tag))
                        )
                    )
                )
            })
        ),
        
        // 创建Prompt模态框
        React.createElement(antd.Modal, {
            title: '创建Prompt',
            open: isCreateModalVisible,
            onOk: handleCreatePrompt,
            onCancel: () => setIsCreateModalVisible(false)
        },
            React.createElement(antd.Form, { layout: 'vertical' },
                React.createElement(antd.Form.Item, { label: '名称', required: true },
                    React.createElement(antd.Input, {
                        value: formData.name,
                        onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                        placeholder: '请输入Prompt名称'
                    })
                ),
                React.createElement(antd.Form.Item, { label: '描述' },
                    React.createElement(antd.Input.TextArea, {
                        value: formData.description,
                        onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                        placeholder: '请输入Prompt描述',
                        rows: 3
                    })
                ),
                React.createElement(antd.Form.Item, { label: '内容', required: true },
                    React.createElement(antd.Input.TextArea, {
                        value: formData.content,
                        onChange: (e) => setFormData({ ...formData, content: e.target.value }),
                        placeholder: '请输入Prompt内容',
                        rows: 6
                    })
                ),
                React.createElement(antd.Form.Item, { label: '分类' },
                    React.createElement(antd.Input, {
                        value: formData.category,
                        onChange: (e) => setFormData({ ...formData, category: e.target.value }),
                        placeholder: '请输入分类'
                    })
                ),
                React.createElement(antd.Form.Item, { label: '标签' },
                    React.createElement(React.Fragment, null,
                        React.createElement(antd.Input, {
                            value: formData.tagInput,
                            onChange: handleTagInput,
                            onPressEnter: handleAddTag,
                            placeholder: '输入标签后按Enter添加'
                        }),
                        React.createElement('div', { className: 'tag-input' },
                            formData.tags.map(tag => React.createElement('div', { key: tag, className: 'tag' },
                                tag,
                                React.createElement('span', { className: 'close', onClick: () => handleRemoveTag(tag) }, '×')
                            ))
                        )
                    )
                )
            )
        )
    );
}
