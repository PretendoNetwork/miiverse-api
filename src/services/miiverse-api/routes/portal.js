var express = require('express');
var xml = require('object-to-xml');
const database = require('../../../database');
var router = express.Router();
var path = require("path");

/* GET discovery server. */
router.get('/titles/show', function (req, res) {
    res.sendFile(path.join(__dirname + '/portal.html'));
});

router.post('/posts', function (req, res) {
    res.sendStatus(200);
});

module.exports = router;
