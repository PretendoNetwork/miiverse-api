const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/', async function(req, res) {
    res.send('Pong!');
});

router.get('/database', async function(req, res) {
    let document = await database.getEndpoints();
    if(document)
        res.send('DB Connection Working! :D');
});

module.exports = router;
