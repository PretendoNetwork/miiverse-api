const express = require('express');
const router = express.Router();
const xml = require('object-to-xml');
const { POST } = require('../../../models/post');
const util = require('../../../util/util');
const database = require('../../../database');
const multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
const communityPostGen = require('../../../util/xmlResponseGenerator');
const {COMMUNITY} = require("../../../models/communities");
const processHeaders = require("../../../util/util");
const comPostGen = require("../../../util/xmlResponseGenerator");
const crypto = require("crypto");
const upload = multer();

/* GET post titles. */
router.post('/', upload.none(), async function (req, res) { await newPost(req, res)});

router.post('/:post_id/replies', upload.none(), async function (req, res) { await newPost(req, res)});

router.post('/:post_id.delete', async function (req, res) {
    const post = await database.getPostByID(req.params.post_id);
    let user = await database.getUserContent(req.pid);
    if(!post || !user)
        return res.sendStatus(504);
    if(post.pid === user.pid) {
        await post.remove('User requested removal');
        res.sendStatus(200);
    }

    else res.sendStatus(401)
});

router.post('/:post_id/empathies', upload.none(), async function (req, res) {
    const post = await database.getPostByID(req.params.post_id);
    if(!post) res.sendStatus(404);
    if(post.yeahs.indexOf(req.pid) === -1) {
        await POST.updateOne({
                id: post.id,
                yeahs: {
                    $ne: req.pid
                }
            },
            {
                $inc: {
                    empathy_count: 1
                },
                $push: {
                    yeahs: req.pid
                }
            });
    }
    else if(post.yeahs.indexOf(req.pid) !== -1) {
        await POST.updateOne({
                id: post.id,
                yeahs: {
                    $eq: req.pid
                }
            },
            {
                $inc: {
                    empathy_count: -1
                },
                $pull: {
                    yeahs: req.pid
                }
            });
    }
    res.sendStatus(200);
});

router.get('/:post_id/replies', async function (req, res) {
    let pid = util.processServiceToken(req.headers["x-nintendo-servicetoken"]);
    const post = await database.getPostByID(req.params.post_id);
    if(!post)
        return res.sendStatus(404);
    const posts = await database.getPostReplies(post.id, req.query.limit)
    if(!posts.length === 0)
        return res.sendStatus(404);
    let options = {
        name: 'replies',
        with_mii: req.query.with_mii === 1,
        topic_tag: true
    }
    /*  Build formatted response and send it off. */
    let response = await communityPostGen.RepliesResponse(posts, options)
    res.contentType("application/xml");
    res.send(response);
});

router.get('', async function (req, res) {
    const post = await database.getPostByID(req.query.post_id);
    if(!post) {
        res.set("Content-Type", "application/xml");
        res.statusCode = 404;
        let response = {
            result: {
                has_error: 1,
                version: 1,
                code: 404,
                message: "Not Found"
            }
        };
        return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
    }
    else res.send(await communityPostGen.QueryResponse(post));
});

module.exports = router;

async function newPost(req, res) {
    let PNID = await database.getPNID(req.pid), userSettings = await database.getUserSettings(req.pid), postID = await generatePostUID(21), parentPost = null;
    let paramPackData = util.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community_id = req.body.community_id;

    let community = await database.getCommunityByID(community_id)
    if(!community)
        community = await COMMUNITY.findOne({olive_community_id: community_id});
    if(!community)
        community = await database.getCommunityByTitleID(paramPackData.title_id);

    if(!community || userSettings.account_status !== 0 || community.community_id === 'announcements')
        return res.sendStatus(403);
    if(req.params.post_id) {
        parentPost = await database.getPostByID(req.params.post_id.toString());
        if(!parentPost)
            return res.sendStatus(403);
    }

    if(!(community.admins && community.admins.indexOf(req.pid) !== -1 && userSettings.account_status === 0)
        && (community.type >= 2) && !(parentPost && community.allows_comments && community.open)) {
        return res.sendStatus(403);
    }

    let appData = "", painting = "", paintingURI = "", screenshot = null;
    if (req.body.app_data)
        appData = req.body.app_data.replace(/[^A-Za-z0-9+/=\s]/g, "");
    if (req.body.painting) {
        painting = req.body.painting.replace(/\0/g, "").trim();
        paintingURI = await util.processPainting(painting, true);
        await util.uploadCDNAsset('pn-cdn', `paintings/${req.pid}/${postID}.png`, paintingURI, 'public-read');
    }
    if (req.body.screenshot) {
        screenshot = req.body.screenshot.replace(/\0/g, "").trim();
        await util.uploadCDNAsset('pn-cdn', `screenshots/${req.pid}/${postID}.jpg`, Buffer.from(screenshot, 'base64'), 'public-read');
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
        body = req.body.body.replace(/[^A-Za-z\d\s-_!@#$%^&*(){}‛¨ƒºª«»“”„¿¡←→↑↓√§¶†‡¦–—⇒⇔¤¢€£¥™©®+×÷=±∞ˇ˘˙¸˛˜′″µ°¹²³♭♪•…¬¯‰¼½¾♡♥●◆■▲▼☆★♀♂,./?;:'"\\<>]/g, "").trim();
    if(body && body.length > 280)
        body = body.substring(0,280);
    if(!body && !painting && !screenshot)
        return res.sendStatus(400);
    const document = {
        title_id: paramPackData.title_id,
        community_id: community.olive_community_id,
        screen_name: userSettings.screen_name,
        body: body,
        app_data: appData,
        painting: painting,
        screenshot: screenshot ? `/screenshots/${req.pid}/${postID}.jpg`: "",
        screenshot_length: screenshot ? screenshot.length : null,
        country_id: paramPackData.country_id,
        created_at: new Date(),
        feeling_id: req.body.feeling_id,
        id: postID,
        search_key: req.body.search_key,
        topic_tag: req.body.topic_tag,
        is_autopost: req.body.is_autopost,
        is_spoiler: (req.body.spoiler) ? 1 : 0,
        is_app_jumpable: req.body.is_app_jumpable,
        language_id: req.body.language_id,
        mii: PNID.mii.data,
        mii_face_url: `https://mii.olv.pretendo.cc/mii/${PNID.pid}/${miiFace}`,
        pid: req.pid,
        platform_id: paramPackData.platform_id,
        region_id: paramPackData.region_id,
        verified: (PNID.access_level === 2 || PNID.access_level === 3),
        parent: parentPost ? parentPost.id : null,
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
    if(parentPost) {
        parentPost.reply_count = parentPost.reply_count + 1;
        parentPost.save();
    }
    res.send(await communityPostGen.SinglePostResponse(newPost));
}

async function generatePostUID(length) {
    let id = Buffer.from(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(length * 2))), 'binary').toString('base64').replace(/[+/]/g, "").substring(0, length);
    const inuse = await POST.findOne({ id });
    id = (inuse ? await generatePostUID(length) : id);
    return id;
}
