const fs = require('fs');
const crypto = require('crypto');
const sq = require('better-sqlite3');

let secret = crypto.randomBytes(20).toString('hex');
let content = "module.exports = {\n" +
  	"\t'secret': '" + secret + "'\n" +
"};";

fs.writeFile('config.js', content, function (err) {
  if (err) throw err;
  console.log('config.js created');
});

let db = new sq('database.db3');
let sql = 'CREATE TABLE IF NOT EXISTS users (\n' +
            '\tid INTEGER PRIMARY KEY AUTOINCREMENT,\n' +
            '\tlogin TEXT NOT NULL,\n' +
            '\tpassword TEXT NOT NULL,\n' +
            '\ttoken TEXT);';
db.exec(sql);
db.close();
console.log('database created');