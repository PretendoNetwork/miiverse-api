var express = require('express');
var router = express.Router();
const database = require('../../../database');
const fs = require('fs-extra');
const util = require('../../../util/authentication');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/titles/show', function (req, res) {
    res.header('X-Nintendo-WhiteList','1|http,youtube.com,,2|https,youtube.com,,2|http,.youtube.com,,2|https,.youtube.com,,2|http,.ytimg.com,,2|https,.ytimg.com,,2|http,.googlevideo.com,,2|https,.googlevideo.com,,2|https,youtube.com,/embed/,6|https,youtube.com,/e/,6|https,youtube.com,/v/,6|https,www.youtube.com,/embed/,6|https,www.youtube.com,/e/,6|https,www.youtube.com,/v/,6|https,youtube.googleapis.com,/e/,6|https,youtube.googleapis.com,/v/,6|http,maps.googleapis.com,/maps/api/streetview,2|https,maps.googleapis.com,/maps/api/streetview,2|http,cbk0.google.com,/cbk,2|https,cbk0.google.com,/cbk,2|http,cbk1.google.com,/cbk,2|https,cbk1.google.com,/cbk,2|http,cbk2.google.com,/cbk,2|https,cbk2.google.com,/cbk,2|http,cbk3.google.com,/cbk,2|https,cbk3.google.com,/cbk,2|https,.cloudfront.net,,2|https,www.google-analytics.com,/,2|https,stats.g.doubleclick.net,,2|https,www.google.com,/ads/,2|https,ssl.google-analytics.com,,2')
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
router.post('/posts/*/empathies', function (req, res, next) {
    let paramPackData = util.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let pid = req.originalUrl.replace('/posts/', '').replace('/empathies','').trim();
    console.log(pid);
    database.connect().then(async emp => {
        let post = await database.getPostByID(parseInt(pid));
        await post.upEmpathy();
    });
    res.status(200);
    res.send();
});
router.post('/posts/*/empathies.delete', function (req, res, next) {
    let paramPackData = util.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let pid = req.originalUrl.replace('/posts/', '').replace('/empathies.delete','').trim();
    console.log(pid);
    database.connect().then(async emp => {
        let post = await database.getPostByID(parseInt(pid));
        await post.downEmpathy();
    });
    res.status(200);
    res.send();
});
router.post('/posts/*/replies', async function (req, res, next) {
    try
    {
        let postID = req.originalUrl.replace('/posts', '').split('/').pop().split('?')[0];
        let pid = util.data.processServiceToken(req.headers["x-nintendo-servicetoken"]);
        if(pid == null)
        {
            throw new Error('The User token was not valid');
        }
        else
        {
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
            let paintingURI = "";
            if (req.body.painting) {
                paintingURI = await util.data.processPainting(painting);
            }
            let screenshot = "";
            if (req.body.screenshot) {
                screenshot = req.body.screenshot.replace(/\0/g, "").trim();
            }
            const document = {
                title_id: req.body.olive_title_id,
                screen_name: usrObj.user_id,
                body: req.body.body,
                app_data: appData,
                painting: painting,
                painting_uri: paintingURI,
                screenshot: screenshot,
                url: req.body.url,
                created_at: creationDate,
                feeling_id: req.body.feeling_id,
                id: snowflake.nextId(),
                is_autopost: req.body.is_autopost,
                is_spoiler: req.body.is_spoiler,
                mii: usrObj.mii,
                mii_face_url: "http://mii-images.account.pretendo.cc/",
            };
            const newPost = new POST(document);
            newPost.save();
            res.sendStatus(200);
        }
    }
    catch (e)
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
router.get('/posts/*', function (req, res) {
    database.connect().then(async e => {
        try
        {
            let postID = req.originalUrl.replace('/posts', '').split('/').pop().split('?')[0];
            console.log(postID);
            let post = await database.getPostByID(parseInt(postID));
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
                    .replace(/OLV_PAGE_TITLE_STANDIN/g, community.name)
                    .replace(/OLV_POST_ID/g, post.id);
                let postContent = '';
                if(post.painting_uri !== undefined && post.painting_uri !== '')
                    postContent += '<p class="post-content-memo"><img src="' + post.painting_uri +'" class="post-memo"></p>';
                else
                    postContent += '<p class="post-content-text">' + post.body + '</p>';
                if(post.screenshot !== undefined && post.screenshot !== '')
                    postContent += '<p class="post-content-text">' + post.body + '</p>'+
                        '<p class="post-content-memo"><img src="data:image/png;base64,' + post.screenshot +'" class="post-screenshot"></p>';
                else if(post.url !== undefined && post.url !== '')
                    postContent += '<iframe width="560" height="315" src="' + post.url.replace('/watch?v=', '/embed/') +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';

                res.send(newFile.replace('OLV_POST_CONTENT', postContent));
            }
        }
        catch (e) {
            res.sendStatus(404);
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
            let newFile = file.replace(/COMMUNITY_TITLE_ID_STANDIN/g, communityID)
                .replace(/OLV_TITLEID_STANDIN/g, community.title_id[0])
                .replace(/OLV_ICON_STANDIN/g, community.browser_icon)
                .replace(/OLV_HEADER_STANDIN/g, community.WiiU_browser_header)
                .replace(/OLV_PAGE_TITLE_STANDIN/g, community.name)
            res.send(newFile);
        }

    });
});

router.get('/communities', function (req, res) {
    database.connect().then(async e => {
        let communities = await database.getCommunities(6);
        if(communities === null)
            res.sendStatus(404);
        else
        {
            let file = '';
            if (req.query._pjax === "#body")
                file = await fs.readFile(`src/html/portal/communities_body.html`, 'utf-8');
            else
                file = await fs.readFile(`src/html/portal/communities.html`, 'utf-8');
            let communityBody = '<ul class="list-content-with-icon-column" id="community-top-content">';
            for(let i = 0; i < communities.length; i++)
            {
                communityBody += '<li id="community-' + communities[i].community_id + '" class="">' +
                    '<span class="icon-container"><img src="' + communities[i].browser_icon + '" class="icon"></span>' +
                    '<a href="/titles/' + communities[i].community_id + '" data-pjax="#body" class="scroll to-community-button"></a>' +
                    '<div class="body">' +
                    '<div class="body-content">' +
                    '<span class="community-name title">' + communities[i].name + '</span>';
                switch(parseInt(communities[i].platform_id))
                {
                    case 0:
                        communityBody += '<span class="platform-tag platform-tag-wiiu"></span><span class="text">Wii U Games</span>';
                        break;
                    case 1:
                        communityBody += '<span class="platform-tag platform-tag-3ds"></span><span class="text">3DS Games</span>';
                        break;
                    case 2:
                        communityBody += '<span class="platform-tag platform-tag-wiiu-3ds"></span><span class="text">Both Platform Games</span>';
                        break;
                }
            }
            res.send(file.replace('OLV_WIIU_NEW_COMMUNITIES', communityBody  + '</div></div></li>'));
        }

    });
});
module.exports = router;