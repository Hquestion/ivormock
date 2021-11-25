const Mock = require('mockjs');

// 输出一个函数，可接受参数，在函数内进行参数判断
module.exports = function(ctx) {
    console.log(ctx)
    return Mock.mock({
        'list|1-100': [{
            'id|+1': 1,
            name: '@cname'
        }]
    });
}