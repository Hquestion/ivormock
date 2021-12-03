const chalk = require("chalk");
const {db} = require("../../database");

module.exports = function(command) {
    let options = command._optionValues;
    // 删除默认值
    for (let key in options) {
        if (command._optionValueSources[key] !== 'cli') {
            delete options[key];
        }
    }
    console.log(options)
    const proj = command.args[0];
    if (!proj) {
        // 不传proj,则是配置ivormock-cli的端口，暂时不处理
        console.log(chalk.red('项目名称必填！'));
        return;
    }
    const projects = db.get('projects').value();
    const index = projects.findIndex(item => item.name === proj);
    if (!projects || projects.length === 0 || index < 0) {
        console.log(chalk.red('项目不存在！'));
        return;
    }
    const projectIns = db.get('projects').get(index);
    Object.entries(options).forEach(([k, v]) => {
        projectIns.set(k, v);
    });
    db.save();
    const message = chalk.green(`项目修改成功！`);
    const info = Object.entries(options).map(([key, value]) => {
        return `${key}: ${value}`;
    }).join('\n');
    console.log(message + '\n' + info);
}