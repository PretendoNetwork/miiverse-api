const express = require('express');
const router = express.Router();
const xml = require('object-to-xml');
const { POST } = require('../../../models/post');
const util = require('../../../util/util');
const database = require('../../../database');
const multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
const communityPostGen = require('../../../util/CommunityPostGen');
const upload = multer();

/* GET post titles. */
router.post('/', upload.none(), async function (req, res) {
    let PNID = await database.getPNID(req.pid), userSettings = await database.getUserSettings(req.pid), postID = snowflake.nextId();
    let paramPackData = util.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await database.getCommunityByTitleID(paramPackData.title_id)
    if(!community || userSettings.account_status !== 0 || community.community_id === 'announcements')
        return res.sendStatus(403);
    let appData = "", painting = "", paintingURI = "", screenshot = null;
    if (req.body.app_data)
        appData = req.body.app_data.replace(/[^A-Za-z0-9+/=\s]/g, "");
    if (req.body.painting) {
        painting = req.body.painting.replace(/\0/g, "").trim();
        paintingURI = await util.data.processPainting(painting, true);
        await util.data.uploadCDNAsset('pn-cdn', `paintings/${req.pid}/${postID}.png`, paintingURI, 'public-read');
    }
    if (req.body.screenshot) {
        screenshot = req.body.screenshot.replace(/\0/g, "").trim();
        await util.data.uploadCDNAsset('pn-cdn', `screenshots/${req.pid}/${postID}.jpg`, Buffer.from(screenshot, 'base64'), 'public-read');
    }

    let miiFace;
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
    let body = req.body.body;
    if(body)
        body = req.body.body.replace(/[^A-Za-z0-9+/=\r?\n|\s]/g, "");
    if(body && body.length > 280)
        body = body.substring(0,280);
    const document = {
        title_id: paramPackData.title_id,
        community_id: community.community_id,
        screen_name: userSettings.screen_name,
        body: body,
        app_data: appData,
        painting: painting,
        screenshot: screenshot ? `/screenshots/${req.pid}/${postID}.jpg`: "",
        country_id: paramPackData.country_id,
        created_at: new Date(),
        feeling_id: req.body.feeling_id,
        id: postID,
        search_key: req.body.search_key,
        is_autopost: req.body.is_autopost,
        is_spoiler: (req.body.spoiler) ? 1 : 0,
        is_app_jumpable: req.body.is_app_jumpable,
        language_id: req.body.language_id,
        mii: PNID.mii.data,
        mii_face_url: `http://mii.olv.pretendo.cc/mii/${PNID.pid}/${miiFace}`,
        pid: req.pid,
        platform_id: paramPackData.platform_id,
        region_id: paramPackData.region_id,
        verified: (PNID.access_level === 2 || PNID.access_level === 3),
        parent: null,
        removed: false
    };
    let duplicatePost = await database.getDuplicatePosts(req.pid, document);
    if(duplicatePost || document.body === '' && document.painting === '' && document.screenshot === '') {
        res.set("Content-Type", "application/xml");
        res.statusCode = 400;
        let response = {
            result: {
                has_error: 1,
                version: 1,
                code: 400,
                error_code: 7,
                message: "DUPLICATE_POST"
            }
        };
        return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
    }
    const newPost = new POST(document);
    newPost.save();
    res.send(await communityPostGen.SinglePostResponse(newPost));
});

router.post('/:post_id/empathies', upload.none(), async function (req, res) {
    let pid = util.data.processServiceToken(req.headers["x-nintendo-servicetoken"]);
    const post = await database.getPostByID(req.params.post_id);
    if(pid === null) {
        res.sendStatus(403);
        return;
    }
    let user = await database.getUserContent(pid);
    if(user.likes.indexOf(post.id) === -1 && user.id !== post.pid)
    {
        post.upEmpathy();
        user.addToLikes(post.id)
        res.sendStatus(200);
    }
    else
        res.sendStatus(200);
});

module.exports = router;
