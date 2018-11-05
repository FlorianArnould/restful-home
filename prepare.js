const fs = require('fs');
const crypto = require('crypto');
const sq = require('better-sqlite3');

let secret = crypto.randomBytes(20).toString('hex');
let content = `export const secret = "${secret}";`;
fs.writeFile('config.ts', content, function (err) {
  if (err) throw err;
  console.log('config.ts created');
});

let data = fs.readFileSync('prepare.sql');

let db = new sq('database.db');
console.log("Creating tables ...");
db.exec(data.toString());
db.close();
console.log('Tables created');