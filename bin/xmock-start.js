const program = require('commander');
const handler = require('./commands/start');

program
    .option('-p --port <port>', '服务端口号')
    .option('-o', '其他配置')
    .parse(process.argv);

handler(program);