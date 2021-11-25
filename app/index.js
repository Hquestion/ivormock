const http = require('http');
const Koa = require('koa');
const chalk = require('chalk');
const minimist = require('minimist');
const portfinder = require('portfinder');

const { db } = require('../database/index');

const defaultPort = 4000;
const args = minimist(process.argv.slice(2));

args.proj = 'demo';

const app = new Koa();

let router;
let routerWatchers = {};

// 如果传入了项目，则去解析项目的路由，并注册路由
if (args.proj) {
    app.context.project = args.project;
    const projRouter = require('./router/project');
    router = projRouter.router;
    projRouter.dealProjectRouter(args.proj);
    routerWatchers[args.proj] = projRouter.watchRouter(args.proj);
} else {
    router = require('./router');
}

app.use(function(ctx, next) {
    next();
})

app.use(router.routes());

let promise;

if (args.proj) {
    const projects = db.get('projects').value();
    const project = projects.find(item => item.name === args.proj);
    promise = project ? Promise.resolve(project.port) : Promise.reject();
} else {
    promise = Promise.resolve(defaultPort);
}


const server = http.createServer(app.callback())

// 监听app状态，更新项目状态

server.on('close', function(e) {
    console.log('app is closed');
    if (args.proj) {
        const projects = db.get('projects').value();
        const projectIndex = projects.findIndex(item => item.name === args.proj);
        db.get('projects').get(projectIndex).set('state', 0);
        db.save();
        const watcher = routerWatchers[args.proj];
        watcher && watcher.unwatchProj && watcher.unwatchProj();
    }
});

promise
    .then(port => portfinder.getPortPromise({port}))
    .then((data) => {
        server.listen(data, function () {
            const msg = chalk.green(`Mock Server ${args.proj ? `for ${args.proj} ` : ''}is listening on ${data}!`)
            console.log(chalk.underline(msg));
            if (args.proj) {
                const projects = db.get('projects').value();
                const projectIndex = projects.findIndex(item => item.name === args.proj);
                db.get('projects').get(projectIndex).set('state', 1).set('usedPort', data);
                db.save();
            }
        });
    });

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
    console.log('server is shutting down');
    server.close();
}


process.on('exit', (code) => {
    console.log(`About to exit with code: ${code}`);
});

