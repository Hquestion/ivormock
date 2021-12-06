const Router = require('@koa/router');
const chokidar = require('chokidar');
const parse = require("./parser");
const {db} = require("../../database");
const path = require('path');

var router = new Router();

router.prefix('/');

/**
 * 处理项目mock路由，获取项目详情，生成路由
 * @param proj
 */
function dealProjectRouter(proj) {
    const projRouters = parse(proj);
    // console.log(projRouters);

    Object.entries(projRouters).forEach(([k, v]) => {
        router[v.method](v.apiName, (ctx, next) => {
            delete require.cache[require.resolve(v.source)];
            const callback = require(v.source);
            const result = callback(ctx);
            ctx.set("X-Response-By", "Ivormock");

            // 支持切换响应
            if (result.$$type === "SWITCH") {
                const active = result.$$on;
                const body = result.$$options;
                let resp = "", status = 200;
                if (Array.isArray(body)) {
                    const data = body.find((item, index) => index === active || item.$$name === active);
                    resp = data && data.$$body || body[0];
                    status = data && +data.$$status || 200;
                } else {
                    if (body[active]) {
                        const data = body[active];
                        if (data.$$status) {
                            status = data.$$status;
                        }
                        if (data.$$body) {
                            resp = data.$$body;
                        } else {
                            resp = data;
                        }
                    } else {
                        if (body.$$body) {
                            resp = body.$$body;
                        } else {
                            resp = body;
                        }
                    }
                }
                ctx.status = status;
                ctx.body = resp;
                return;
            }
            if (result.$$status) {
                ctx.status = result.$$status;
                ctx.body = result.$$body;
                return;
            }
            ctx.status = 200;
            ctx.body = result;
        });
    });
}

function watchRouter(proj) {
    const projects = db.get('projects').value();
    const project = projects.find(item => item.name === proj);
    const mockDir = path.resolve(project.base, project.mockPath);
    const watcher = chokidar.watch(mockDir).on('change', function() {
        console.log(`项目 "${proj}" mock文件改变，重载路由...`);
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