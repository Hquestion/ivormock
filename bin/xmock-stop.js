const program = require('commander');
const handler = require('./commands/stop');

program
    .parse(process.argv);

handler(program);