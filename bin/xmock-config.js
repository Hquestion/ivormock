const program = require('commander');
const handler = require('./commands/config.js');

program
    .option('-b, --base <base>', '项目本地绝对路径')
    .option('-mp, --mock-path <mockPath>', 'mock文件目录绝对路径', 'mock')
    .option('-p --port <port>', '项目mock服务端口号')
    .option('-d --desc <decription>', '项目描述')
    .parse(process.argv);

handler(program);
