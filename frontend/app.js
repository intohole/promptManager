// 主应用组件
function App() {
    const [activeTab, setActiveTab] = React.useState('prompts');
    const [prompts, setPrompts] = React.useState([]);
    const [selectedPrompt, setSelectedPrompt] = React.useState(null);
    const [versions, setVersions] = React.useState([]);
    const [tokens, setTokens] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    
    const { message } = antd;
    
    // 获取所有Prompts
    const fetchPrompts = async () => {
        try {
            const data = await API.Prompt.getAll();
            setPrompts(data);
        } catch (error) {
            console.error('Failed to fetch prompts:', error);
            message.error('获取Prompt列表失败');
        }
    };
    
    // 获取所有Tokens
    const fetchTokens = async () => {
        try {
            const data = await API.Token.getAll();
            setTokens(data);
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
            message.error('获取Token列表失败');
        }
    };
    
    // 初始化数据
    React.useEffect(() => {
        fetchPrompts();
        fetchTokens();
    }, []);
    
    // 处理选择Prompt
    const handleSelectPrompt = async (prompt) => {
        setSelectedPrompt(prompt);
        try {
            const data = await API.Version.getAllByPromptId(prompt.id);
            setVersions(data);
            setActiveTab('versions');
        } catch (error) {
            console.error('Failed to fetch versions:', error);
            message.error('获取版本列表失败');
        }
    };
    
    // 处理编辑Prompt
    const handleEditPrompt = (prompt) => {
        // 这里可以实现编辑功能，或者跳转到编辑页面
        message.info('编辑功能待实现');
    };
    
    // 处理删除Prompt
    const handleDeletePrompt = async (promptId) => {
        if (window.confirm('确定要删除这个Prompt吗？')) {
            try {
                await API.Prompt.delete(promptId);
                message.success('Prompt删除成功');
                fetchPrompts();
            } catch (error) {
                console.error('Failed to delete prompt:', error);
                message.error('删除Prompt失败');
            }
        }
    };
    
    // 处理搜索
    const handleSearch = async () => {
        if (!searchQuery) {
            fetchPrompts();
            return;
        }
        try {
            const searchResults = await API.Prompt.search(searchQuery);
            // 根据搜索结果获取完整的Prompt信息
            const promptIds = searchResults.map(item => item.prompt_id);
            const fullPrompts = await Promise.all(
                promptIds.map(id => API.Prompt.getById(id))
            );
            setPrompts(fullPrompts);
        } catch (error) {
            console.error('Failed to search prompts:', error);
            message.error('搜索失败');
        }
    };
    
    // 渲染不同的标签页内容
    const renderTabContent = () => {
        switch (activeTab) {
            case 'prompts':
                return React.createElement(HomePage, {
                    prompts: prompts,
                    onSelectPrompt: handleSelectPrompt,
                    onEditPrompt: handleEditPrompt,
                    onDeletePrompt: handleDeletePrompt,
                    onSearch: handleSearch,
                    searchQuery: searchQuery,
                    setSearchQuery: setSearchQuery
                });
            case 'versions':
                return React.createElement(VersionPage, {
                    prompt: selectedPrompt,
                    versions: versions,
                    onBack: () => setActiveTab('prompts')
                });
            case 'tokens':
                return React.createElement(TokenPage, {
                    tokens: tokens,
                    onRefresh: fetchTokens
                });
            default:
                return React.createElement(HomePage, {
                    prompts: prompts,
                    onSelectPrompt: handleSelectPrompt,
                    onEditPrompt: handleEditPrompt,
                    onDeletePrompt: handleDeletePrompt,
                    onSearch: handleSearch,
                    searchQuery: searchQuery,
                    setSearchQuery: setSearchQuery
                });
        }
    };
    
    return React.createElement('div', { className: 'app-container' },
        // 侧边栏
        React.createElement('div', { className: 'sidebar' },
            React.createElement('h1', null, 'Prompt Manager'),
            React.createElement('div', {
                className: `menu-item ${activeTab === 'prompts' ? 'active' : ''}`,
                onClick: () => {
                    setActiveTab('prompts');
                }
            }, 'Prompt列表'),
            React.createElement('div', {
                className: `menu-item ${activeTab === 'tokens' ? 'active' : ''}`,
                onClick: () => setActiveTab('tokens')
            }, 'Token管理')
        ),
        
        // 主内容区
        React.createElement('div', { className: 'main-content' },
            renderTabContent()
        )
    );
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
