const { db } = require("./database");
const { stopServer, startServer, createProject } = require("./bin/commands/base");

const findPathProject = function(path) {
    const projects = db.get("projects").value();
    return projects.find(item => item.base === path);
}

module.exports = {
    findPathProject,
    stopServer,
    startServer,
    createProject
}