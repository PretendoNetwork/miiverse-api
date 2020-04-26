var express = require('express');
var router = express.Router();
const moment = require('moment');
const { POST } = require('../../../models/post');
const processHeaders = require('../../../util/processHeaders');
var multer  = require('multer');
var upload = multer();

/* GET post titles. */
router.post('/', upload.none(), function (req, res, next) {

    let paramPack = req.get('x-nintendo-parampack');
    let paramPackData = processHeaders.data.decodeParamPack(paramPack);
    /*let dec = Buffer.from(paramPack, "base64").toString("ascii");
    dec = dec.slice(1, -1).split("\\");
    const paramPackData = {};
    for (let i = 0; i < dec.length; i += 2) {
        paramPackData[dec[i].trim()] = dec[i + 1].trim();
    }*/
    const creationDate = moment().format('YYYY-MM-DDTHH:MM:SS');
    const document = {
        body: req.body.body,
        app_data: req.body.app_data,
        painting: req.body.painting,
        screenshot: req.body.screenshot,
        search_key: req.body.search_key,
        community_id: req.body.community_id,
        country_id: paramPackData.country_id,
        created_at: creationDate,
        feeling_id: req.body.feeling_id,
        id: 0,
        is_autopost: req.body.is_autopost,
        is_spoiler: req.body.is_spoiler,
        is_app_jumpable: req.body.is_app_jumpable,
        language_id: req.body.language_id,
        mii: "mii_string",
        mii_face_url: "mii_face",
        pid: 0,
        platform_id: paramPackData.platform_id,
        region_id: paramPackData.region_id,
        screen_name: "unknown",
        title_id: paramPackData.title_id,
    };
    const newPost = new POST(document);
    newPost.save();
    res.sendStatus(200);
});

module.exports = router;