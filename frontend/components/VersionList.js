// 版本列表组件
function VersionList({ prompt, versions, onBack }) {
    const [selectedVersion1, setSelectedVersion1] = React.useState(null);
    const [selectedVersion2, setSelectedVersion2] = React.useState(null);
    const [diffContent, setDiffContent] = React.useState('');
    const diffRef = React.useRef(null);
    
    // 处理查看差异
    const handleViewDiff = async () => {
        if (!selectedVersion1 || !selectedVersion2) {
            alert('请选择两个版本进行对比');
            return;
        }
        
        try {
            const response = await API.Version.getDiff(prompt.id, selectedVersion1, selectedVersion2);
            setDiffContent(response.diff);
            
            // 使用HTML展示差异
            setTimeout(() => {
                if (diffRef.current) {
                    diffRef.current.innerHTML = response.diff;
                }
            }, 0);
        } catch (error) {
            console.error('Failed to get diff:', error);
            alert('获取差异失败: ' + error.message);
        }
    };
    
    if (!prompt) {
        return React.createElement('div', null,
            React.createElement('button', { className: 'btn', onClick: onBack }, '返回'),
            React.createElement('h2', null, '请先选择一个Prompt')
        );
    }
    
    return React.createElement('div', null,
        React.createElement('div', { className: 'header' },
            React.createElement('button', { className: 'btn', onClick: onBack }, '返回'),
            React.createElement('h2', null, `${prompt.name} - 版本管理`)
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'card-title' }, '版本对比'),
            React.createElement('div', { className: 'version-compare' },
                React.createElement('select', {
                    placeholder: '选择版本1',
                    className: 'select',
                    value: selectedVersion1 || '',
                    onChange: (e) => setSelectedVersion1(parseInt(e.target.value))
                },
                    React.createElement('option', { value: '', disabled: true }, '选择版本1'),
                    versions.map(version => React.createElement('option', {
                        key: version.version_number,
                        value: version.version_number
                    },
                        `版本 ${version.version_number} (${new Date(version.created_at).toLocaleString()})`
                    ))
                ),
                React.createElement('span', { className: 'vs' }, 'vs'),
                React.createElement('select', {
                    placeholder: '选择版本2',
                    className: 'select',
                    value: selectedVersion2 || '',
                    onChange: (e) => setSelectedVersion2(parseInt(e.target.value))
                },
                    React.createElement('option', { value: '', disabled: true }, '选择版本2'),
                    versions.map(version => React.createElement('option', {
                        key: version.version_number,
                        value: version.version_number
                    },
                        `版本 ${version.version_number} (${new Date(version.created_at).toLocaleString()})`
                    ))
                ),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: handleViewDiff
                }, '查看差异')
            ),
            
            diffContent && React.createElement('div', {
                className: 'diff-container',
                ref: diffRef
            })
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('h3', { className: 'card-title' }, '版本列表'),
            React.createElement('div', { className: 'version-list' },
                versions.map(version => React.createElement('div', { key: version.id, className: 'version-item' },
                    React.createElement('div', { className: 'version-item-header' },
                        React.createElement('h4', null, `版本 ${version.version_number}`),
                        React.createElement('button', {
                            className: 'btn btn-small',
                            onClick: () => {
                                if (!selectedVersion1) {
                                    setSelectedVersion1(version.version_number);
                                } else {
                                    setSelectedVersion2(version.version_number);
                                }
                            }
                        }, '选择对比')
                    ),
                    React.createElement('div', { className: 'version-item-meta' },
                        React.createElement('p', null, `创建时间: ${new Date(version.created_at).toLocaleString()}`),
                        React.createElement('p', null, `创建人: ${version.created_by}`),
                        React.createElement('p', null, `备注: ${version.comment || '无'}`)
                    )
                ))
            )
        )
    );
}