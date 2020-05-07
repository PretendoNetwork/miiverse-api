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
    try
    {
        let paramPackData = util.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
        let pid = util.data.processServiceToken(req.headers["x-nintendo-servicetoken"]);
        let usrObj;
        usrObj = await util.data.processUser(pid);
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
            screen_name: usrObj.user_id,
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
            mii: usrObj.mii,
            mii_face_url: "http://mii-images.account.pretendo.cc/",
            pid: pid,
            platform_id: paramPackData.platform_id,
            region_id: paramPackData.region_id,
        };
        const newPost = new POST(document);
        newPost.save();
        res.sendStatus(200);
    }
    catch (e)
    {
        console.error(e);
    }
    finally
    {
        res.set("Content-Type", "application/xml");
        res.statusCode = 400;
        response = {
            result: {
                has_error: 1,
                version: 1,
                code: 400,
                error_code: 7,
                message: "POSTING_FROM_NNID"
            }
        };
        res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
    }

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