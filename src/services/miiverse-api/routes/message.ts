import crypto from "node:crypto";
import express from 'express';
import multer  from 'multer';
import { Snowflake } from 'node-snowflake';
import moment from 'moment';
import xml from 'object-to-xml';
import { getFriends, decodeParamPack, processPainting, uploadCDNAsset } from '@/util';
import { getPNID, getConversationByUsers, getUserSettings, getConversationByID, getFriendMessages } from '@/database';
import { Post } from '@/models/post';
import { Conversation } from '@/models/conversation';

const router = express.Router();
const upload = multer();

router.post('/', upload.none(), async function (req, res) {
    let user = await getPNID(req.pid);
    let user2 = await getPNID(req.body.message_to_pid);
    let conversation = await getConversationByUsers([user.pid, user2.pid]);
    let userSettings = await getUserSettings(req.pid), user2Settings = await getUserSettings(user2.pid), postID = await generatePostUID(21);
    let friends = await getFriends(user2.pid);
    if(!conversation) {
        if(!user || !user2 || userSettings || userSettings)
            return res.sendStatus(422)
        let document = {
            id: Snowflake.nextId(),
            users: [
                {
                    pid: user.pid,
                    official: (user.access_level === 2 || user.access_level === 3),
                    read: true
                },
                {
                    pid: user2.pid,
                    official: (user2.access_level === 2 || user2.access_level === 3),
                    read: false
                },
            ]
        };
        const newConversations = new Conversation(document);
        await newConversations.save();
        conversation = await getConversationByID(document.id);
    }
    if(!conversation)
        return res.sendStatus(404);
    if(!friends || friends.pids.indexOf(req.pid) === -1)
        return res.sendStatus(422);

    if(req.body.body === '' && req.body.painting === ''  && req.body.screenshot === '') {
        res.status(422);
        return res.redirect(`/friend_messages/${conversation.id}`);
    }
    let paramPackData = decodeParamPack(req.headers["x-nintendo-parampack"]);
    let appData = "", painting = "", paintingURI, screenshot = null;
    if (req.body.app_data)
        appData = req.body.app_data.replace(/[^A-Za-z0-9+/=\s]/g, "");
    if (req.body.painting) {
        painting = req.body.painting.replace(/\0/g, "").trim();
        paintingURI = await processPainting(painting, true);
        await uploadCDNAsset('pn-cdn', `paintings/${req.pid}/${postID}.png`, paintingURI, 'public-read');
    }
    if (req.body.screenshot) {
        screenshot = req.body.screenshot.replace(/\0/g, "").trim();
        await uploadCDNAsset('pn-cdn', `screenshots/${req.pid}/${postID}.jpg`, Buffer.from(screenshot, 'base64'), 'public-read');
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
        body = req.body.body.replace(/[^A-Za-z\d\s-_!@#$%^&*(){}‛¨ƒºª«»“”„¿¡←→↑↓√§¶†‡¦–—⇒⇔¤¢€£¥™©®+×÷=±∞ˇ˘˙¸˛˜′″µ°¹²³♭♪•…¬¯‰¼½¾♡♥●◆■▲▼☆★♀♂,./?;:'"\\<>]/g, "");
    if(body.length > 280)
        body = body.substring(0,280);
    const document = {
        title_id: paramPackData.title_id,
        community_id: conversation.id,
        screen_name: user.mii.name,
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
        mii: user.mii.data,
        mii_face_url: `https://mii.olv.pretendo.cc/mii/${user.pid}/${miiFace}`,
        pid: req.pid,
        platform_id: paramPackData.platform_id,
        region_id: paramPackData.region_id,
        verified: (user.access_level === 2 || user.access_level === 3),
        message_to_pid: req.body.message_to_pid,
        parent:  null,
        removed: false
    };
    const newPost = new Post(document);
    newPost.save();
    res.sendStatus(200);
    let postPreviewText;
    if(document.painting)
        postPreviewText = 'sent a Drawing'
    else if(document.body.length > 25)
        postPreviewText = document.body.substring(0, 25) + '...';
    else
        postPreviewText = document.body;
    await conversation.newMessage(postPreviewText, document.message_to_pid);
});

router.get('/', async function(req, res) {
    let limit = parseInt(req.query.limit as string), search_key = req.query.search_key;
    let posts = await getFriendMessages(req.pid, search_key, limit);

    let postBody = [];
    for(let post of posts) {
        console.log(post)
        postBody.push({
            post: {
                body: post.body,
                country_id: post.country_id || 0,
                created_at: moment(post.created_at).format('YYYY-MM-DD HH:MM:SS'),
                feeling_id: post.feeling_id || 0,
                id: post.id,
                is_autopost: post.is_autopost,
                is_spoiler: post.is_spoiler,
                is_app_jumpable: post.is_app_jumpable,
                empathy_added: post.empathy_count,
                language_id: post.language_id,
                message_to_pid: post.message_to_pid,
                mii: post.mii,
                mii_face_url: post.mii_face_url,
                number: post.number || 0,
                pid: post.pid,
                platform_id: post.platform_id || 0,
                region_id: post.region_id || 0,
                reply_count: post.reply_count,
                screen_name: post.screen_name,
                topic_tag: {
                    name: post.topic_tag,
                    title_id: 0
                },
                title_id: post.title_id
            }
        });
    }
    res.set("Content-Type", "application/xml");
    let response = {
        result: {
            has_error: 0,
            version: 1,
            request_name: 'friend_messages',
            posts: postBody
        }
    };
    return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
});

router.post('/:post_id/empathies', upload.none(), async function (req, res) {
    // TODO - FOR JEMMA! FIX THIS! MISSING SCHEMA METHODS
    /*
    let pid = processServiceToken(req.headers["x-nintendo-servicetoken"]);
    const post = await getPostByID(req.params.post_id);
    if(pid === null) {
        res.sendStatus(403);
        return;
    }
    let user = await getUserByPID(pid);
    if(user.likes.indexOf(post.id) === -1 && user.id !== post.pid)
    {
        post.upEmpathy();
        user.addToLikes(post.id)
        res.sendStatus(200);
    }
    else
        res.sendStatus(403);
    */
});

async function generatePostUID(length) {
    let id = Buffer.from(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(length * 2))), 'binary').toString('base64').replace(/[+/]/g, "").substring(0, length);
    const inuse = await Post.findOne({ id });
    id = (inuse ? await generatePostUID(length) : id);
    return id;
}

export default router;