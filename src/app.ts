import * as express from 'express';

export const app = express();

app.get('/api', function (req, res) {
    res.status(200).send({ running: true });
});

app.use('/api', require('./auth/AuthController').router.getExpressRouter());

app.use('/api/device', require('./device/DeviceController').router.getExpressRouter());

app.use('/api/stream', require('./stream/StreamController').router.getExpressRouter());