const killports = require('killports');
const {db} = require("../../database");
const chalk = require("chalk");

/**
 * 停止mock服务
 * 当前简单实现：直接杀掉端口
 * @param command
 */
module.exports = function(command) {
    const proj = command.args[0];

    const projects = db.get('projects').value();
    const index = projects.findIndex(item => item.name === proj);
    const project = projects[index];
    if (!project) {
        console.log(chalk.red('项目不存在!'));
        process.exit(1);
    }
    if (project.state !== 1) {
        console.log(chalk.red('项目未启动!'));
        process.exit(1);
    }
    const port = project.usedPort || project.port;
    killports([port]).then(() => {
        console.log(chalk.green(`停止项目${proj}成功!`));
        db.get('projects').get(index).set('state', 0).set('usedPort', null);
        db.save();
    });
}