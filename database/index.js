const path = require('path');
const StormDB = require('stormdb');
// start db with "./db.stormdb" storage location

const home = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOMEPATH;
const dbLocation = path.resolve(home, './db.stormdb');


const engine = new StormDB.localFileEngine(dbLocation);
const db = new StormDB(engine);

// set default db value if db is empty
db.default({ projects: [] });

module.exports = {
    db
}