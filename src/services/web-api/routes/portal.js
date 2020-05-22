var express = require('express');
var router = express.Router();
const database = require('../../../database');
const fs = require('fs-extra');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/titles/show', function (req, res) {
    res.redirect('/communities');
});
router.get('/settings/profile', function (req, res) {
    res.sendFile("settings_body.html", { root: 'src/html/portal' });
});
router.get('/friend_messages', function (req, res) {
    res.sendFile("messages_body.html", { root: 'src/html/portal' });
});
router.get('/news/my_news', function (req, res) {
    res.sendFile("notifications_body.html", { root: 'src/html/portal' });
});
router.get('/identified_user_posts', function (req, res) {
    res.sendFile("verified_post_body.html", { root: 'src/html/portal' });
});
router.get('/', function (req, res) {
    res.sendFile("feed_body.html", { root: 'src/html/portal' });
});
router.get('/users/*', function (req, res) {
    res.sendFile("user_body.html", { root: 'src/html/portal' });
});
router.get('/wiiu-emulation.js', function (req, res) {
    res.sendFile("wiiu-emulation.js", { root: 'src/html/portal' });
});
router.get('/portal.js', function (req, res) {
    res.sendFile("portal.js", { root: 'src/html/portal' });
});
router.get('/portal.css', function (req, res) {
    res.sendFile("portal.css", { root: 'src/html/portal' });
});
router.get('/*/wiiu-emulation.js', function (req, res) {
    res.sendFile("wiiu-emulation.js", { root: 'src/html/portal' });
});
router.get('/*/portal.js', function (req, res) {
    res.sendFile("portal.js", { root: 'src/html/portal' });
});
router.get('/*/portal.css', function (req, res) {
    res.sendFile("portal.css", { root: 'src/html/portal' });
});
router.get('/posts/*', function (req, res) {
    database.connect().then(async e => {
        let postID = req.originalUrl.replace('/posts', '').split('/').pop().split('?')[0];
        console.log(postID);
        let post = await database.getPostByID(postID);
        let community = await database.getCommunityByTitleID(post.title_id);
        if(post === null)
            res.sendStatus(404);
        else
        {
            let file = '';
            if (req.query._pjax === "#body")
                file = await fs.readFile(`src/html/portal/post_body.html`, 'utf-8');
            else
                file = await fs.readFile(`src/html/portal/post.html`, 'utf-8');
            let newFile = file.replace(/OLV_DISPLAY_NAME/g, post.screen_name)
                .replace(/OLV_TOPIC_TAG/g, post.topic_tag)
                .replace(/OLV_ICON_STANDIN/g, community.browser_icon)
                .replace(/OLV_COMMUNITY_ID/g, community.community_id)
                .replace(/OLV_POST_TIMESTAMP/g, post.created_at)
                .replace(/OLV_PAGE_TITLE_STANDIN/g, community.name);
            let postContent = '';
            if(post.screenshot !== undefined && post.screenshot !== '')
                postContent = '<p class="post-content-text">' + post.body + '</p>'+
                '<p class="post-content-memo"><img src="data:image/png;base64,' + post.screenshot +'" class="post-screenshot"></p>';
            else if(post.painting_uri !== undefined && post.painting_uri !== '')
                postContent = '<p class="post-content-memo"><img src="' + post.painting_uri +'" class="post-memo"></p>';
            else
                postContent = '<p class="post-content-text">' + post.body + '</p>';
            res.send(newFile.replace('OLV_POST_CONTENT', postContent));
        }

    });
});
router.get('/titles/*', function (req, res) {
    database.connect().then(async e => {
        let communityID = req.originalUrl.replace('/titles/', '').replace('?_pjax=%23body', '');
        let community = await database.getCommunityByID(communityID);
        if(community === null)
            res.sendStatus(404);
        else
        {
            let file = '';
            if (req.query._pjax === "#body")
                file = await fs.readFile(`src/html/portal/community_body.html`, 'utf-8');
            else
                file = await fs.readFile(`src/html/portal/community.html`, 'utf-8');
            let newFile = file.replace('COMMUNITY_TITLE_ID_STANDIN', communityID)
                .replace('OLV_TITLEID_STANDIN', communityID)
                .replace('OLV_ICON_STANDIN', community.browser_icon)
                .replace('OLV_HEADER_STANDIN', community.WiiU_browser_header)
                .replace(/OLV_PAGE_TITLE_STANDIN/g, community.name)
            res.send(newFile);
        }

    });
});

router.get('/communities', function (req, res) {
    if (req.query._pjax === "#body")
        res.sendFile("communities_body.html", { root: 'src/html/portal' });
    else
        res.sendFile("communities.html", { root: 'src/html/portal' });
});
module.exports = router;