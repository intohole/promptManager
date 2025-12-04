// 首页 - 展示Prompt列表
function HomePage({ 
    prompts, 
    onSelectPrompt, 
    onEditPrompt, 
    onDeletePrompt, 
    onSearch, 
    searchQuery, 
    setSearchQuery 
}) {
    return React.createElement(React.Fragment, null,
        React.createElement(PromptList, {
            prompts: prompts,
            onSelectPrompt: onSelectPrompt,
            onEditPrompt: onEditPrompt,
            onDeletePrompt: onDeletePrompt,
            onSearch: onSearch,
            searchQuery: searchQuery,
            setSearchQuery: setSearchQuery
        })
    );
}
