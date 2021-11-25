const {spawn} = require("child_process");
const {db} = require("../../database/index");
const chalk = require("chalk");
const path = require("path");

const serverAbsPath = path.resolve(__dirname, '../../app/index.js');

let states = {
    proj: []
}

function startServer(proj) {
    let server;
    if (!proj) {
        // 不传名称启动xmock-cli服务
        server = spawn('node', [serverAbsPath], { shell: true, stdio: 'inherit', stderr: 'inherit' });
        return;
    }
    // 判断项目是否存在
    const projects = db.get('projects').value();
    const project = projects.find(item => item.name === proj);
    const projectIndex = projects.findIndex(item => item.name === proj);
    if (!project) {
        console.log(chalk.red('项目不存在！'));
        process.exit(1);
    }
    server = spawn('node', [serverAbsPath, '--proj='+proj], { shell: true, stdio: 'inherit', stderr: 'inherit' });
    states.proj.push(proj);
    // db.get('projects').get(projectIndex).set('state', 1);
    // db.save();

    // server.on('connected', function(){
    //     console.log('connected');
    // });
    // server.on('close', function() {
    //     console.log('closed!!!!');
    //     const index = states.proj.findIndex(p => p === proj);
    //     if(index >= 0) {
    //         states.proj.splice(index, 1);
    //     }
    //     db.get('projects').get(projectIndex).set('state', 0);
    //     db.save();
    // });

    server.on('disconnect', function () {
        db.get('projects').get(projectIndex).set('state', 0);
        db.save();
    })

}

module.exports = {
    startServer,
    states
};