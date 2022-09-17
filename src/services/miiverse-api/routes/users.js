var express = require('express');
var router = express.Router();
const moment = require('moment');
var xml = require('object-to-xml');
const { POST } = require('../../../models/post');
const { CONVERSATION } = require('../../../models/conversation');
const util = require('../../../util/util');
const database = require('../../../database');
var multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
var upload = multer();

router.get('/:pid/notifications', async function(req, res, next) {
    let type = req.query.type, title_id = req.query.title_id;
    console.log(type);
    console.log(title_id);
    console.log(req.params.pid);

    res.set("Content-Type", "application/xml");
    let response = {
        result: {
            has_error: 0,
            version: 1,
            posts: " "
        }
    };
    return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
});

module.exports = router;
