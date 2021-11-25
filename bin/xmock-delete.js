const program = require('commander');
const handler = require('./commands/delete.js');

program
    .option('-f --force', '强制删除')
    .parse(process.argv);

handler(program);
