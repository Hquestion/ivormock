const {spawn, fork} = require("child_process");
const {db} = require("../../database/index");
const chalk = require("chalk");
const path = require("path");
const shortId = require("shortid");
const shortid = require("shortid");

const serverAbsPath = path.resolve(__dirname, '../../app/index.js');

function startServer(proj) {
    let _resolve, _reject;
    const promise = new Promise((resolve, reject) => {
        _reject = reject;
        _resolve = resolve;
    })
    let server;
    if (!proj) {
        // 不传名称启动ivormock-cli服务
        server = spawn('node', [serverAbsPath], { shell: true, stdio: 'inherit', stderr: 'inherit' });
        _resolve();
        return promise;
    }
    // 判断项目是否存在
    const projects = db.get('projects').value();
    const project = projects.find(item => item.name === proj);
    const projectIndex = projects.findIndex(item => item.name === proj);
    if (!project) {
        console.log(chalk.red('项目不存在！'));
        process.exit(1);
    }
    server = fork(serverAbsPath, ['--proj='+proj], { shell: true, stdio: 'inherit', stderr: 'inherit' });
    let ppid;
    server.on("message", function(msg) {
        if (typeof msg === "string") {
            msg = JSON.parse(msg);
        }
        if (msg.type === "startServer") {
            db.get("projects").get(projectIndex).set("state", 1).set("pid", msg.pid).set("ppid", msg.ppid).set("usedPort", msg.port);
            db.save();
            ppid = msg.ppid;
            _resolve();
        } else if (msg.type === "killServer") {
            db.get("projects").get(projectIndex).set("state", 0).set("pid", null).set("ppid", null).set("usedPort", null);
            db.save();
            _reject();
        }
    });

    server.on("exit", function() {
        db.get("projects").get(projectIndex).set("state", 0).set("pid", null).set("ppid", null).set("usedPort", null);
        db.save();
        process.kill(ppid);
    });
    return promise;
}

function stopServer(proj) {
    let index, port, pid, projectName = proj;
    const projects = db.get("projects").value();
    if (typeof projectName === "string") {
        index = projects.findIndex(item => item.name === projectName);
        const project = projects[index];
        if (!project) {
            console.log(chalk.red("项目不存在！"));
            process.exit(1);
        }
        if (project.state !== 1 || !project.pid) {
            console.log(chalk.red("项目未启动！"));
            return Promise.resolve();
        }
        pid = project.pid;
    } else if (typeof projectName === "object"){
        projectName = proj.name;
        index = projects.findIndex(item => item.name === projectName);
        pid = proj.pid;
    }
    try {
        process.kill(pid)
    }catch (e) {
        console.log("kill pid error: ", e);
    } finally {
        console.log(chalk.green(`停止项目 "${projectName}" 成功!`));
        db.get("projects").get(index).set("state", 0).set("pid", null).set("ppid", null).set("usedPort", null);
        db.save();
    }
    return Promise.resolve();
}

function createProject(options) {
    const { name, port, base, mockPath } = options;
    if (!name) {
        console.log('项目名称不能为空！');
        process.exit(1);
    }
    const projects = db.get('projects').value();
    if (projects.some(item => item.name === name)) {
        console.log('项目已存在！');
        process.exit(1);
    }
    const project = {
        name: name,
        id: shortid.generate(),
        port: port || 6000,
        base: base || '',
        mockPath: mockPath || ''
    }

    db.get('projects').push(project);

    db.save();

    if (!project.base || !project.mockPath) {
        console.log(chalk.yellow(`项目信息不完善，请及时补充，否则项目不可用!
可使用 'ivormock config <name> --base xxx'配置项目信息
        `))
    } else {
        console.log(chalk.green('项目创建成功！'));
    }
    return project;
}

module.exports = {
    startServer,
    stopServer,
    createProject
};