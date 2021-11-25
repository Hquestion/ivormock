function underline2slash(str) {
    return str.replace(/_/g, '/');
}

function prefixSlash(str) {
    if (str.charAt(0) === '/') return str;
    return '/' + str;
}

module.exports = {
    underline2slash,
    prefixSlash
}