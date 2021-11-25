const Router = require('@koa/router');
const parse = require("./parser");

var router = new Router();

router.prefix('/xmock');

router.get('/', (ctx, next) => {
    ctx.body = 'Hello there, Mock Server is running well!';
});


module.exports = router;