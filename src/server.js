const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('ssl/key.pem', 'utf8');
const certificate = fs.readFileSync('ssl/cert.pem', 'utf8');

let credentials = {key: privateKey, cert: certificate, passphrase: 'coucou'};
const app = require('./app');

const httpsServer = https.createServer(credentials, app);

const port = process.env.PORT || 3000;

httpsServer.listen(port, function() {
    console.log('Express server listening on port ' + port);
});