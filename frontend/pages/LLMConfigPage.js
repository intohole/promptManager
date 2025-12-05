// LLM配置管理页面
function LLMConfigPage({ llmConfigs, tokens, onRefresh }) {
    return React.createElement(React.Fragment, null,
        React.createElement(LLMConfigList, {
            llmConfigs: llmConfigs,
            tokens: tokens,
            onRefresh: onRefresh
        })
    );
}
