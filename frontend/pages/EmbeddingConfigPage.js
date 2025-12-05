// Embedding配置页面
function EmbeddingConfigPage({ embeddingConfigs, tokens, onRefresh }) {
    return React.createElement('div', { className: 'embedding-config-page' },
        React.createElement(EmbeddingConfigList, {
            embeddingConfigs: embeddingConfigs,
            tokens: tokens,
            onRefresh: onRefresh
        })
    );
}
