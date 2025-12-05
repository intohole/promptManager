// Embedding测试页面
function EmbeddingTestPage({ embeddingConfigs, tokens, onRefresh }) {
    return React.createElement('div', { className: 'embedding-test-page' },
        React.createElement(EmbeddingTest, {
            embeddingConfigs: embeddingConfigs,
            tokens: tokens,
            onRefresh: onRefresh
        })
    );
}