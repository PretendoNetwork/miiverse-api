var express = require('express');
var router = express.Router();
const moment = require('moment');
var xml = require('object-to-xml');
const { POST } = require('../../../models/post');
const util = require('../../../util/authentication');
const database = require('../../../database');
var multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
var upload = multer();

/* GET post titles. */
router.post('/', upload.none(), async function (req, res, next) {
    const creationDate = moment().format('YYYY-MM-DD HH:MM:SS');
    let appData = "";
    if (req.body.app_data) {
        appData = req.body.app_data.replace(/\0/g, "").trim();
    }
    let painting;
    if (req.body.painting) {
        painting = req.body.painting.replace(/\0/g, "").trim();
    }
    let paintingURI;
    if (req.body.painting) {
        paintingURI = await util.data.processPainting(painting);
    }
    let screenshot;
    if (req.body.screenshot) {
        screenshot = req.body.screenshot.replace(/\0/g, "").trim();
    }
    const document = {
        title_id: req.body.olive_title_id,
        screen_name: "olv-web-user",
        body: req.body.body,
        app_data: appData,
        painting: painting,
        painting_uri: paintingURI,
        screenshot: screenshot,
        url: req.body.url,
        search_key: req.body.search_key,
        topic_tag: req.body.topic_tag,
        community_id: req.body.community_id,
        country_id: 0,
        created_at: creationDate,
        feeling_id: req.body.feeling_id,
        id: snowflake.nextId(),
        is_autopost: req.body.is_autopost,
        is_spoiler: req.body.is_spoiler,
        is_app_jumpable: req.body.is_app_jumpable,
        language_id: req.body.language_id,
        mii: "olv-web-user-mii",
        mii_face_url: "http://mii-images.account.pretendo.cc/",
        pid: 11111,
        platform_id: 0,
        region_id: 0,
    };
    console.log(document);
    const newPost = new POST(document);
    newPost.save();
    res.sendStatus(200);
});

router.post('/*/empathies', upload.none(), function (req, res, next) {
    let paramPackData = util.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let pid = req.originalUrl.replace('/v1/posts/', '').replace('/empathies','').trim();
    database.connect().then(async emp => {
        const post = await database.getPostByID(pid);
        await post.upEmpathy();
    });
    res.status(200);
    res.send();
});

module.exports = router;