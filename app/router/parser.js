const path = require('path');
const fs = require('fs');
const {underline2slash, prefixSlash} = require("../utils");
const {db} = require("../../database/index");
const allowMethods = ['get', 'post', 'put', 'del'];


function parse(proj) {
    const projects = db.get('projects').value();
    const project = projects.find(item => item.name === proj);
    const projPath = project.base;
    const mockFilesDir = path.resolve(projPath, project.mockPath);

    if(!fs.existsSync(mockFilesDir)) {
        throw new Error('mock路径不存在，请检查项目配置！');
    }

    // 遍历文件树以获取mock路由映射表
    return walkFolder(mockFilesDir);
}

function walkFolder(dir, base = '') {
    const baseDir = path.resolve(base, dir);
    const dirs = fs.readdirSync(baseDir);
    let result = {};
    dirs.forEach(d => {
        const filePath = path.resolve(baseDir, d);
        const stat = fs.lstatSync(filePath);
        if (stat.isFile()) {
            const ext = path.extname(filePath);
            if (ext === '.js') {
                // name like 'get__api_v1_users'
                const fileName = path.basename(d, ext);
                let [method, apiName] = fileName.split('__');
                // 如果存在方法, 则覆盖默认方法
                if (!allowMethods.includes(method.toLowerCase())) {
                    apiName = method;
                    method = 'get';
                }
                apiName = underline2slash(apiName);
                result[fileName] = {
                    method,
                    apiName: prefixSlash(apiName),
                    source: filePath
                }
            }
        } else {
            const res = walkFolder(d, baseDir);
            result = Object.assign({}, result, res);
        }
    })
    return result;
}

module.exports = parse;
