var express = require('express');
var router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/', function (req, res) {
    res.sendFile("ctr.html", { root: 'html' });
});

module.exports = router;