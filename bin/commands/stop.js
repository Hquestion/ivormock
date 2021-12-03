const killports = require('killports');
const {db} = require("../../database");
const chalk = require("chalk");
const { stopServer } = require("./base");

/**
 * 停止mock服务
 * 当前简单实现：直接杀掉端口
 * @param command
 */
module.exports = function(command) {
    const proj = command.args[0];

    stopServer(proj);
}