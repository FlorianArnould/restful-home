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

let data = fs.readFileSync('prepare.sql');

let db = new sq('database.db3');
console.log("Creating tables ...");
db.exec(data.toString());
db.close();
console.log('Tables created');