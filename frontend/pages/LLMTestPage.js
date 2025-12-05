// LLM测试页面
function LLMTestPage({ llmConfigs, prompts, tokens, onRefresh }) {
    return React.createElement('div', { className: 'llm-test-page' },
        React.createElement(LLMTest, {
            llmConfigs: llmConfigs,
            prompts: prompts,
            tokens: tokens,
            onRefresh: onRefresh
        })
    );
}