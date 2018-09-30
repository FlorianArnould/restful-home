const express = require('express');
const app = express();
global.__root   = __dirname + '/'; 

app.get('/api', function (req, res) {
    res.status(200).send('API works.');
});

const AuthController = require(__root + 'auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;