const { db } = require('../../database/index');
const chalk = require("chalk");

module.exports = function(command) {
    const options = command._optionValues;
    const proj = command.args[0];
    let projects = db.get('projects').value();
    let projectIndex = projects.findIndex(item => item.name === proj);
    if (!proj || projectIndex < 0) {
        console.log('项目不存在！');
        process.exit(1);
    }
    db.get('projects').get(projectIndex).delete(true);
    db.save();
    console.log(chalk.green(`项目${proj}已删除！`));
}