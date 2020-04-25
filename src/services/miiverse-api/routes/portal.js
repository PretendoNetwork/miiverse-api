var express = require('express');
var xml = require('object-to-xml');
const database = require('../../../database');
var router = express.Router();
var path = require("path");

/* GET portal server. */
router.get('/titles/show', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/index.html'));
});
/* GET olv.js server. */
router.get('/js/olv.js', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/js/olv.js'));
});

router.post('/posts', function (req, res) {
    res.sendStatus(200);
});

module.exports = router;
