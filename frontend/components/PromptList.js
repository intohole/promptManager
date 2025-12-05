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
    const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
    const [formData, setFormData] = React.useState({
        id: null,
        name: '',
        description: '',
        content: '',
        category: '',
        tags: [],
        tagInput: '',
        model_params: {}
    });
    
    // 处理创建Prompt
    const handleCreatePrompt = async () => {
        try {
            await API.Prompt.create({
                ...formData,
                model_params: formData.model_params || {}
            });
            alert('Prompt创建成功');
            setIsCreateModalVisible(false);
            // 刷新父组件的Prompts列表
            window.location.reload();
        } catch (error) {
            console.error('Failed to create prompt:', error);
            alert('创建Prompt失败: ' + error.message);
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
    
    // 处理编辑Prompt
    const handleEdit = (prompt) => {
        // 填充表单数据
        setFormData({
            id: prompt.id,
            name: prompt.name,
            description: prompt.description || '',
            content: prompt.content,
            category: prompt.category || '',
            tags: prompt.tags || [],
            tagInput: '',
            model_params: prompt.model_params || {}
        });
        setIsEditModalVisible(true);
    };
    
    // 处理保存编辑
    const handleSaveEdit = async () => {
        try {
            await API.Prompt.update(formData.id, {
                ...formData,
                model_params: formData.model_params || {}
            });
            alert('Prompt更新成功');
            setIsEditModalVisible(false);
            // 刷新页面或通知父组件刷新
            window.location.reload();
        } catch (error) {
            console.error('Failed to update prompt:', error);
            alert('更新Prompt失败: ' + error.message);
        }
    };
    
    // 处理取消编辑
    const handleCancelEdit = () => {
        setIsEditModalVisible(false);
    };
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement('h2', null, 'Prompt列表'),
            React.createElement('div', { className: 'header-buttons' },
                React.createElement('input', {
                    type: 'text',
                    placeholder: '搜索Prompt',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    onKeyPress: (e) => e.key === 'Enter' && onSearch(),
                    className: 'search-input'
                }),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: onSearch
                }, '搜索'),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => setIsCreateModalVisible(true)
                }, '创建Prompt')
            )
        ),
        
        React.createElement('div', { className: 'prompt-grid' },
            prompts.map((prompt) => React.createElement('div', { key: prompt.id, className: 'prompt-card' },
                React.createElement('div', { className: 'prompt-card-header' },
                    React.createElement('h3', null, prompt.name),
                    React.createElement('div', { className: 'prompt-card-actions' },
                        React.createElement('button', {
                            className: 'btn btn-small',
                            onClick: () => onSelectPrompt(prompt)
                        }, '版本'),
                        React.createElement('button', {
                            className: 'btn btn-small',
                            onClick: () => handleEdit(prompt)
                        }, '编辑'),
                        React.createElement('button', {
                            className: 'btn btn-small btn-danger',
                            onClick: () => onDeletePrompt(prompt.id)
                        }, '删除')
                    )
                ),
                React.createElement('div', { className: 'prompt-card-content' },
                    React.createElement('p', null, prompt.description || '无描述'),
                    React.createElement('div', { className: 'tags' },
                        prompt.tags && prompt.tags.map(tag => React.createElement('span', { key: tag, className: 'tag' }, tag))
                    )
                )
            ))
        ),
        
        // 创建Prompt模态框
        isCreateModalVisible && React.createElement('div', { className: 'modal-overlay' },
            React.createElement('div', { className: 'modal' },
                React.createElement('div', { className: 'modal-header' },
                    React.createElement('h3', null, '创建Prompt'),
                    React.createElement('button', {
                        className: 'close-btn',
                        onClick: () => setIsCreateModalVisible(false)
                    }, '×')
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('form', { className: 'form' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'name' }, '名称*'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'name',
                                value: formData.name,
                                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                                placeholder: '请输入Prompt名称',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'description' }, '描述'),
                            React.createElement('textarea', {
                                id: 'description',
                                value: formData.description,
                                onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                                placeholder: '请输入Prompt描述',
                                className: 'form-textarea',
                                rows: 3
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'content' }, '内容*'),
                            React.createElement('textarea', {
                                id: 'content',
                                value: formData.content,
                                onChange: (e) => setFormData({ ...formData, content: e.target.value }),
                                placeholder: '请输入Prompt内容',
                                className: 'form-textarea',
                                rows: 6
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'category' }, '分类'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'category',
                                value: formData.category,
                                onChange: (e) => setFormData({ ...formData, category: e.target.value }),
                                placeholder: '请输入分类',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, '标签'),
                            React.createElement('div', null,
                                React.createElement('input', {
                                    type: 'text',
                                    value: formData.tagInput,
                                    onChange: handleTagInput,
                                    onKeyPress: (e) => e.key === 'Enter' && handleAddTag(),
                                    placeholder: '输入标签后按Enter添加',
                                    className: 'form-input'
                                }),
                                React.createElement('div', { className: 'tags-input' },
                                    formData.tags.map(tag => React.createElement('span', { key: tag, className: 'tag' },
                                        tag,
                                        React.createElement('span', {
                                            className: 'tag-close',
                                            onClick: () => handleRemoveTag(tag)
                                        }, '×')
                                    ))
                                )
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-prompt-model-params' }, '模型参数 (JSON格式)'),
                            React.createElement('textarea', {
                                type: 'text',
                                id: 'edit-prompt-model-params',
                                value: JSON.stringify(formData.model_params, null, 2),
                                onChange: (e) => {
                                    try {
                                        setFormData({ ...formData, model_params: JSON.parse(e.target.value) });
                                    } catch (error) {
                                        // 忽略无效JSON，等待用户输入正确格式
                                    }
                                },
                                placeholder: '{"temperature": 0.1, "max_tokens": 2048}',
                                className: 'form-textarea',
                                rows: 4
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-prompt-model-params' }, '模型参数 (JSON格式)'),
                            React.createElement('textarea', {
                                type: 'text',
                                id: 'edit-prompt-model-params',
                                value: JSON.stringify(formData.model_params, null, 2),
                                onChange: (e) => {
                                    try {
                                        setFormData({ ...formData, model_params: JSON.parse(e.target.value) });
                                    } catch (error) {
                                        // 忽略无效JSON，等待用户输入正确格式
                                    }
                                },
                                placeholder: '{"temperature": 0.1, "max_tokens": 2048}',
                                className: 'form-textarea',
                                rows: 4
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'prompt-model-params' }, '模型参数 (JSON格式)'),
                            React.createElement('textarea', {
                                type: 'text',
                                id: 'prompt-model-params',
                                value: JSON.stringify(formData.model_params, null, 2),
                                onChange: (e) => {
                                    try {
                                        setFormData({ ...formData, model_params: JSON.parse(e.target.value) });
                                    } catch (error) {
                                        // 忽略无效JSON，等待用户输入正确格式
                                    }
                                },
                                placeholder: '{"temperature": 0.1, "max_tokens": 2048}',
                                className: 'form-textarea',
                                rows: 4
                            })
                        )
                    )
                ),
                React.createElement('div', { className: 'modal-footer' },
                    React.createElement('button', {
                        className: 'btn',
                        onClick: () => setIsCreateModalVisible(false)
                    }, '取消'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: handleCreatePrompt
                    }, '确定')
                )
            )
        ),
        
        // 编辑Prompt模态框
        isEditModalVisible && React.createElement('div', { className: 'modal-overlay' },
            React.createElement('div', { className: 'modal' },
                React.createElement('div', { className: 'modal-header' },
                    React.createElement('h3', null, '编辑Prompt'),
                    React.createElement('button', {
                        className: 'close-btn',
                        onClick: () => setIsEditModalVisible(false)
                    }, '×')
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('form', { className: 'form' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-name' }, '名称*'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'edit-name',
                                value: formData.name,
                                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                                placeholder: '请输入Prompt名称',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-description' }, '描述'),
                            React.createElement('textarea', {
                                id: 'edit-description',
                                value: formData.description,
                                onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                                placeholder: '请输入Prompt描述',
                                className: 'form-textarea',
                                rows: 3
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-content' }, '内容*'),
                            React.createElement('textarea', {
                                id: 'edit-content',
                                value: formData.content,
                                onChange: (e) => setFormData({ ...formData, content: e.target.value }),
                                placeholder: '请输入Prompt内容',
                                className: 'form-textarea',
                                rows: 6
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-category' }, '分类'),
                            React.createElement('input', {
                                type: 'text',
                                id: 'edit-category',
                                value: formData.category,
                                onChange: (e) => setFormData({ ...formData, category: e.target.value }),
                                placeholder: '请输入分类',
                                className: 'form-input'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, '标签'),
                            React.createElement('div', null,
                                React.createElement('input', {
                                    type: 'text',
                                    value: formData.tagInput,
                                    onChange: handleTagInput,
                                    onKeyPress: (e) => e.key === 'Enter' && handleAddTag(),
                                    placeholder: '输入标签后按Enter添加',
                                    className: 'form-input'
                                }),
                                React.createElement('div', { className: 'tags-input' },
                                    formData.tags.map(tag => React.createElement('span', { key: tag, className: 'tag' },
                                        tag,
                                        React.createElement('span', {
                                            className: 'tag-close',
                                            onClick: () => handleRemoveTag(tag)
                                        }, '×')
                                    ))
                                )
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'edit-prompt-model-params' }, '模型参数 (JSON格式)'),
                            React.createElement('textarea', {
                                type: 'text',
                                id: 'edit-prompt-model-params',
                                value: JSON.stringify(formData.model_params, null, 2),
                                onChange: (e) => {
                                    try {
                                        setFormData({ ...formData, model_params: JSON.parse(e.target.value) });
                                    } catch (error) {
                                        // 忽略无效JSON，等待用户输入正确格式
                                    }
                                },
                                placeholder: '{"temperature": 0.1, "max_tokens": 2048}',
                                className: 'form-textarea',
                                rows: 4
                            })
                        )
                    )
                ),
                React.createElement('div', { className: 'modal-footer' },
                    React.createElement('button', {
                        className: 'btn',
                        onClick: handleCancelEdit
                    }, '取消'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: handleSaveEdit
                    }, '保存')
                )
            )
        )
    );
}