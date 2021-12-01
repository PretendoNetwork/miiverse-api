var express = require('express');
var router = express.Router();
const moment = require('moment');
var xml = require('object-to-xml');
const { POST } = require('../../../models/post');
const util = require('../../../util/util');
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
        if(pid === null)
        {
            throw new Error('The User token was not valid');
        }
        else
        {
            let user = await util.data.processUser(pid);
            let community = await database.getCommunityByTitleID(paramPackData.title_id)
            let appData = "";
            if (req.body.app_data) {
                appData = req.body.app_data.replace(/\0/g, "").replace(/\r?\n|\r/g, "").trim();
            }
            let painting = "";
            if (req.body.painting) {
                painting = req.body.painting.replace(/\0/g, "").replace(/\r?\n|\r/g, "").trim();
            }
            let paintingURI = "";
            if (req.body.painting) {
                paintingURI = await util.data.processPainting(painting);
            }
            let screenshot = "";
            if (req.body.screenshot) {
                screenshot = req.body.screenshot.replace(/\0/g, "").trim();
            }

            let miiFace;
            console.log(parseInt(req.body.feeling_id))
            switch (parseInt(req.body.feeling_id)) {
                case 1:
                    miiFace = 'smile_open_mouth.png';
                    break;
                case 2:
                    miiFace = 'wink_left.png';
                    break;
                case 3:
                    miiFace = 'surprise_open_mouth.png';
                    break;
                case 4:
                    miiFace = 'frustrated.png';
                    break;
                case 5:
                    miiFace = 'sorrow.png';
                    break;
                default:
                    miiFace = 'normal_face.png';
                    break;
            }

            const document = {
                title_id: paramPackData.title_id,
                screen_name: user.user_id,
                body: req.body.body,
                app_data: appData,
                painting: painting,
                painting_uri: paintingURI,
                screenshot: screenshot,
                url: req.body.url,
                search_key: req.body.search_key,
                topic_tag: req.body.topic_tag,
                community_id: community.community_id,
                country_id: paramPackData.country_id,
                created_at: new Date(),
                feeling_id: req.body.feeling_id,
                id: snowflake.nextId(),
                is_autopost: req.body.is_autopost,
                is_spoiler: req.body.is_spoiler,
                is_app_jumpable: req.body.is_app_jumpable,
                language_id: req.body.language_id,
                mii: user.mii,
                mii_face_url: `http://mii.olv.pretendo.cc/mii/${user.pid}/${miiFace}`,
                pid: user.pid,
                verified: user.official,
                platform_id: paramPackData.platform_id,
                region_id: paramPackData.region_id,
                parent: null,
            };
            const newPost = new POST(document);
            newPost.save();
            res.sendStatus(200);
        }
    }
    catch (e)
    {
        console.error(e);
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

router.post('/:post_id/empathies', upload.none(), async function (req, res, next) {
    let pid = util.data.processServiceToken(req.headers["x-nintendo-servicetoken"]);
    const post = await database.getPostByID(req.params.post_id);
    if(pid === null) {
        res.sendStatus(403);
        return;
    }
    let user = await database.getUserByPID(pid);
    if(user.likes.indexOf(post.id) === -1 && user.id !== post.pid)
    {
        post.upEmpathy();
        user.addToLikes(post.id)
        res.sendStatus(200);
    }
    else
        res.sendStatus(403);
});

module.exports = router;
