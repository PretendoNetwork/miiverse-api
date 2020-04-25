var express = require('express');
var router = express.Router();
var path = require("path");

/* GET ctr server. */
router.get('/titles/show', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/index.html'));
});
/* GET css. */
router.get('/titles/css/n3ds/style.css', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/css/n3ds/style.css'));
});
/* GET cave emulation. */
router.get('/titles/js/src/cave-emulation.js', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/js/src/cave-emulation.js'));
});
/* GET olv.js server. */
router.get('/titles/js/n3ds/libs.js', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/js/n3ds/libs.js'));
});
/* GET olv.js server. */
router.get('/titles/js/n3ds/olv.js', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/js/n3ds/olv.js'));
});
/* GET olv.js server. */
router.get('/titles/js/n3ds/olv.locale-en.js', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/js/n3ds/olv.locale-en.js'));
});
/* GET jquery server. */
router.get('/titles/js/jquery-1.9.1.min.js', function (req, res) {
    res.sendFile(path.join(__dirname + '../../../../portal/js/jquery-1.9.1.min.js'));
});
/* GET played titles. */
router.post('/settings/played_title_ids', function (req, res) {
    res.sendStatus(200);
});
/* GET check update */
router.get('/check_update.json', function (req, res) {
    res.sendStatus(200);
});
/* GET local list */
router.get('/local_list.json', function (req, res) {
    res.sendStatus(200);
});
router.post('/posts', function (req, res) {
    res.sendStatus(200);
});

module.exports = router;
