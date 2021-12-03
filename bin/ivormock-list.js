const program = require('commander');
const handler = require('./commands/list.js');

program
    .option('-r --run', '只展示运行中的项目')
    .parse(process.argv);

handler(program);
