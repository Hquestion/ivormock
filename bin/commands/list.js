const { db } = require('../../database/index');

module.exports = function(command) {
    const options = command._optionValues;
    let projects = db.get('projects').value();
    if (options.run) {
        projects = projects.filter(p => p.state === 1);
    }
    const str = `项目名称               端口               位置
-------------------------------------------
`
    const projDesc = projects.map(p => {
        return `${p.name}              ${p.port}         ${p.base}`
    }).join('\n');
    console.log(str + projDesc);
}