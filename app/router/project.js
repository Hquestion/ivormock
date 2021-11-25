const Router = require('@koa/router');
const chokidar = require('chokidar');
const parse = require("./parser");
const {db} = require("../../database");
const path = require('path');

var router = new Router();

router.prefix('/mock');

/**
 * 处理项目mock路由，获取项目详情，生成路由
 * @param proj
 */
function dealProjectRouter(proj) {
    const projRouters = parse(proj);

    Object.entries(projRouters).forEach(([k, v]) => {
        router[v.method](v.apiName, (ctx, next) => {
            delete require.cache[require.resolve(v.source)];
            const callback = require(v.source);
            console.log(callback)
            ctx.body = callback(ctx);
        });
    });
}

function watchRouter(proj) {
    const projects = db.get('projects').value();
    const project = projects.find(item => item.name === proj);
    const mockDir = path.resolve(project.base, project.mockPath);
    const watcher = chokidar.watch(mockDir).on('all', function() {
        console.log(`项目${proj}mock文件改变，重载路由。。。`);
        // 重载路由
        dealProjectRouter(proj);
    });
    watcher.unwatchProj = () => watcher.unwatch(mockDir);
    return watcher;
}


module.exports = {
    router,
    dealProjectRouter,
    watchRouter
};