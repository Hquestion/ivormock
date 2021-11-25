#!/usr/bin/env node

const program = require('commander');
const pck = require('../package.json');
const chalk = require('chalk');

console.log(chalk.bgBlue('welcome xmock!'));

program
    .name('xmock')
    .version(pck.version)
    .command('create <name>', '创建项目')
    .command('delete <name>', '删除项目')
    .command('config <name>', '修改项目配置')
    .command('list', '获取所有项目列表')
    .command('start <name>', '启动项目')
    .command('stop <name>', '停止项目')
    .command('restart <name>', '重启项目')
    .command('doc <cmd>', 'xmock文档相关管理，TBD')
    .parse(process.argv);

module.exports = program;
