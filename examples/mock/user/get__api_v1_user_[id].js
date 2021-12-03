module.exports = function(ctx) {
    console.log(ctx);

    return {
        $$on: 1,
        $$type: "SWITCH",
        $$options: [
            {
                $$name: 'fail',
                $$status: 500,
                $$body: {
                    code: '50000',
                    message: "服务器出错了"
                }
            },
            {
                $$name: 'success',
                $$status: 200,
                $$body: {
                    code: '0',
                    message: "我是成功的响应"
                }
            }
        ]
    }
}