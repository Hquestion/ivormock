/**
 * 启动cli服务或者项目mock服务
 * 1. 检查项目名称是否存在，不存在则启动xmock-cli服务
 * 2. 检查项目是否存在，不存在则抛出异常，报错
 * 3. 启动koa服务器，并将项目名称传递给koa
 * 4. koa根据项目决定用什么路由启动服务
 * @param command
 */
const { startServer } = require('./base');

module.exports = function(command) {
    const name = command.args[0];
    startServer(name);
}