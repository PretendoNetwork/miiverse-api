var express = require('express');
var router = express.Router();
const database = require('../../../database');

router.get('/', async function(req, res, next) {
    res.send('Pong!');
});

router.get('/database', async function(req, res, next) {
    let document = await database.getEndpoints();
    if(document)
        res.send('DB Connection Working! :D');
});

module.exports = router;
