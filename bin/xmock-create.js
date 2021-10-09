const program = require('commander');
const chalk = require('chalk');

program
    .command('create')
    .arguments('<name>')
    .option('-b, --base', '项目本地绝对路径')
    .option('-mp, --mock-path', 'mock文件目录绝对路径')
    .option('-p, --port', '项目mock服务端口号')
    .option('-o', '其他配置')
    .parse(process.argv)
    .action(() => {
        console.log(arguments)
    })

module.exports = program;
