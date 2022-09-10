import {readFileSync} from "fs";
import {createServer} from "https";
import {app} from "./app";
import {DeviceManager} from "./device/DeviceManager";

const privateKey = readFileSync('ssl/key.pem', 'utf8');
const certificate = readFileSync('ssl/cert.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate, passphrase: 'coucou'};

const httpsServer = createServer(credentials, app);

const port = process.env.PORT || 3000;

httpsServer.listen(port, function() {
    console.log('Express server listening on port ' + port);
    DeviceManager.getInstance().initialize(() => console.log("RFXCOM ready"));
});