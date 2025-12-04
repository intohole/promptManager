// 版本列表组件
function VersionList({ prompt, versions, onBack }) {
    const [selectedVersion1, setSelectedVersion1] = React.useState(null);
    const [selectedVersion2, setSelectedVersion2] = React.useState(null);
    const [diffContent, setDiffContent] = React.useState('');
    const diffRef = React.useRef(null);
    
    const { message } = antd;
    
    // 处理查看差异
    const handleViewDiff = async () => {
        if (!selectedVersion1 || !selectedVersion2) {
            message.warning('请选择两个版本进行对比');
            return;
        }
        
        try {
            const response = await API.Version.getDiff(prompt.id, selectedVersion1, selectedVersion2);
            setDiffContent(response.diff);
            
            // 使用CodeMirror展示差异
            setTimeout(() => {
                if (diffRef.current) {
                    // 简单的HTML差异展示
                    diffRef.current.innerHTML = response.diff;
                }
            }, 0);
        } catch (error) {
            console.error('Failed to get diff:', error);
            message.error('获取差异失败');
        }
    };
    
    if (!prompt) {
        return React.createElement('div', null,
            React.createElement(antd.Button, { onClick: onBack }, '返回'),
            React.createElement('h2', null, '请先选择一个Prompt')
        );
    }
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement(antd.Space, null,
                React.createElement(antd.Button, { onClick: onBack }, '返回'),
                React.createElement('h2', null, `${prompt.name} - 版本管理`)
            )
        ),
        
        React.createElement(antd.Card, { title: '版本对比', style: { marginBottom: 20 } },
            React.createElement(antd.Space, null,
                React.createElement(antd.Select, {
                    placeholder: '选择版本1',
                    style: { width: 200 },
                    onChange: setSelectedVersion1
                },
                    versions.map(version => React.createElement(antd.Select.Option, {
                        key: version.version_number,
                        value: version.version_number
                    },
                        `版本 ${version.version_number} (${new Date(version.created_at).toLocaleString()})`
                    ))
                ),
                React.createElement('span', null, 'vs'),
                React.createElement(antd.Select, {
                    placeholder: '选择版本2',
                    style: { width: 200 },
                    onChange: setSelectedVersion2
                },
                    versions.map(version => React.createElement(antd.Select.Option, {
                        key: version.version_number,
                        value: version.version_number
                    },
                        `版本 ${version.version_number} (${new Date(version.created_at).toLocaleString()})`
                    ))
                ),
                React.createElement(antd.Button, {
                    type: 'primary',
                    onClick: handleViewDiff
                }, '查看差异')
            ),
            
            diffContent && React.createElement('div', {
                className: 'diff-container',
                ref: diffRef,
                style: { marginTop: 20 }
            })
        ),
        
        React.createElement(antd.Card, { title: '版本列表' },
            React.createElement(antd.List, {
                dataSource: versions,
                renderItem: (version) => React.createElement(antd.List.Item, {
                    actions: [
                        React.createElement(antd.Button, {
                            size: 'small',
                            onClick: () => {
                                if (!selectedVersion1) {
                                    setSelectedVersion1(version.version_number);
                                } else {
                                    setSelectedVersion2(version.version_number);
                                }
                            }
                        }, '选择对比')
                    ]
                },
                    React.createElement(antd.List.Item.Meta, {
                        title: `版本 ${version.version_number}`,
                        description: React.createElement('div', null,
                            React.createElement('p', null, `创建时间: ${new Date(version.created_at).toLocaleString()}`),
                            React.createElement('p', null, `创建人: ${version.created_by}`),
                            React.createElement('p', null, `备注: ${version.comment || '无'}`)
                        )
                    })
                )
            })
        )
    );
}
