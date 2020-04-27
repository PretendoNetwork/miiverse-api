var express = require('express');
var router = express.Router();
const moment = require('moment');
const { POST } = require('../../../models/post');
const processHeaders = require('../../../util/processHeaders');
const database = require('../../../database');
var multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
var upload = multer();

/* GET post titles. */
router.post('/', upload.none(), function (req, res, next) {
    let paramPackData = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    /*let dec = Buffer.from(paramPack, "base64").toString("ascii");
    dec = dec.slice(1, -1).split("\\");
    const paramPackData = {};
    for (let i = 0; i < dec.length; i += 2) {
        paramPackData[dec[i].trim()] = dec[i + 1].trim();
    }*/
    const creationDate = moment().format('YYYY-MM-DD HH:MM:SS');
    let appData = "";
    if (req.body.app_data) {
        appData = req.body.app_data.replace(/\0/g, "").trim();
    }
    let painting = "";
    if (req.body.painting) {
        painting = req.body.painting.replace(/\0/g, "").trim();
    }
    let screenshot = "";
    if (req.body.screenshot) {
        screenshot = req.body.screenshot.replace(/\0/g, "").trim();
    }
    const document = {
        title_id: paramPackData.title_id,
        screen_name: "unknown",
        body: req.body.body,
        app_data: appData,
        painting: painting,
        screenshot: screenshot,
        url: req.body.url,
        search_key: req.body.search_key,
        topic_tag: req.body.topic_tag,
        community_id: req.body.community_id,
        country_id: paramPackData.country_id,
        created_at: creationDate,
        feeling_id: req.body.feeling_id,
        id: snowflake.nextId(),
        is_autopost: req.body.is_autopost,
        is_spoiler: req.body.is_spoiler,
        is_app_jumpable: req.body.is_app_jumpable,
        language_id: req.body.language_id,
        mii: "mii_string",
        mii_face_url: "mii_face",
        pid: 0,
        platform_id: paramPackData.platform_id,
        region_id: paramPackData.region_id,
    };
    const newPost = new POST(document);
    newPost.save();
    res.sendStatus(200);
});

router.post('/*/empathies', upload.none(), function (req, res, next) {
    let paramPackData = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let pid = req.originalUrl.replace('/v1/posts/', '').replace('/empathies','').trim();
    database.connect().then(async emp => {
        const post = await database.getPostByID(pid);
        console.log(post.empathy_count);
        await post.upEmpathy();
        console.log(post.empathy_count);
    });
    res.status(200);
    res.send();
});

module.exports = router;