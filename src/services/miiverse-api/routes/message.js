const express = require('express');
const router = express.Router();
const moment = require('moment');
const xml = require('object-to-xml');
const { POST } = require('../../../models/post');
const { CONVERSATION } = require('../../../models/conversation');
const util = require('../../../util/util');
const database = require('../../../database');
const multer  = require('multer');
const crypto = require("crypto");
const snowflake = require('node-snowflake').Snowflake;
const upload = multer();

router.post('/', upload.none(), async function (req, res) {
    let user = await database.getPNID(req.pid);
    let user2 = await database.getPNID(req.body.message_to_pid);
    let conversation = await database.getConversationByUsers([user.pid, user2.pid]);
    if(!conversation) {
        if(!user || !user2)
            return res.sendStatus(422)
        let document = {
            id: snowflake.nextId(),
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
        const newConversations = new CONVERSATION(document);
        await newConversations.save();
        conversation = await database.getConversationByID(document.id);
    }
    if(!conversation)
        return res.sendStatus(404);
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
    let document = {
        screen_name: user.mii.name,
        body: req.body.body,
        painting: req.body.raw,
        created_at: new Date(),
        id: generatePostUID(21),
        mii: user.mii.data,
        mii_face_url: `https://mii.olv.pretendo.cc/mii/${PNID.pid}/${miiFace}`,
        pid: user.pid,
        verified: (user.access_level === 2 || user.access_level === 3),
        parent: null,
        search_key: req.body.search_key,
        topic_tag: req.body.topic_tag,
        community_id: conversation.id,
        message_to_pid: req.body.message_to_pid,
        title_id: req.paramPackData.title_id,
    };
    const newPost = new POST(document);
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
    let limit = parseInt(req.query.limit), search_key = req.query.search_key;
    let posts = await database.getFriendMessages(req.pid, search_key, limit);
    posts = posts.length === 0 ? " " : posts
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
    let pid = util.processServiceToken(req.headers["x-nintendo-servicetoken"]);
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

async function generatePostUID(length) {
    let id = Buffer.from(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(length * 2))), 'binary').toString('base64').replace(/[+/]/g, "").substring(0, length);
    const inuse = await POST.findOne({ id });
    id = (inuse ? await generatePostUID(length) : id);
    return id;
}

module.exports = router;
