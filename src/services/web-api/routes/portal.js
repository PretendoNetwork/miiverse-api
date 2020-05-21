var express = require('express');
var router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/show', function (req, res) {
    res.sendFile("portal.html", { root: 'src/html' });
});
/*router.get('/wiiu-emulation.js', function (req, res) {
    res.sendFile("wiiu-emulation.js", { root: 'html' });
});*/
router.get('/portal.js', function (req, res) {
    res.sendFile("portal.js", { root: 'src/html' });
});
router.get('/portal.css', function (req, res) {
    res.sendFile("portal.css", { root: 'src/html' });
});

module.exports = router;