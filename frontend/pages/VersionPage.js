// 版本管理页面
function VersionPage({ prompt, versions, onBack }) {
    return React.createElement(React.Fragment, null,
        React.createElement(VersionList, {
            prompt: prompt,
            versions: versions,
            onBack: onBack
        })
    );
}
