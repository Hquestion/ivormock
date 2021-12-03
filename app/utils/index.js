function underline2slash(str) {
    return str.replace(/_/g, '/');
}

function prefixSlash(str) {
    if (str.charAt(0) === '/') return str;
    return '/' + str;
}

function resolveDynamicParams(apiName) {
    const reg = /\[([^\]]+)\]/g;
    return apiName.replace(reg, function(match, val) {
        return `:${val}`;
    });
}

module.exports = {
    underline2slash,
    prefixSlash,
    resolveDynamicParams
}