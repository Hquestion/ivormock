const { db } = require('../../database/index');
const shortid = require('shortid');
const chalk = require("chalk");

module.exports = function(command) {
    const name = command.args[0];
    const options = command._optionValues;
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
        port: options.port || 6000,
        base: options.base || '',
        mockPath: options.mockPath || ''
    }

    db.get('projects').push(project);

    db.save();

    if (!project.base || !project.mockPath) {
        console.log(chalk.yellow(`项目信息不完善，请及时补充，否则项目不可用!
可使用 'xmock config <name> --base xxx'配置项目信息
        `))
    } else {
        console.log(chalk.green('项目创建成功！'));
    }
}