// Token管理页面
function TokenPage({ tokens, onRefresh }) {
    return React.createElement(React.Fragment, null,
        React.createElement(TokenList, {
            tokens: tokens,
            onRefresh: onRefresh
        })
    );
}
