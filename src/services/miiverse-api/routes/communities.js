const express = require('express');
const router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/util');
const {COMMUNITY} = require("../../../models/communities");
const {POST} = require("../../../models/post");

/* GET post titles. */
router.get('/', async function (req, res) {
    const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await database.getCommunityByTitleID(paramPack.title_id);
    if(!community) res.sendStatus(404);

    let communities = await database.getSubCommunities(community.community_id);
    if(!communities) res.sendStatus(404);
    communities.unshift(community);
    let response = await comPostGen.Communities(communities);
    res.contentType("application/xml");
    res.send(response);
});

router.get('/popular', async function (req, res) {
    let community = await database.getMostPopularCommunities(100);
    if (community != null) {
        res.contentType("application/json");
        res.send(community);
    } else {
        res.status(404);
        res.send();
    }
});

router.get('/new', async function (req, res) {
    let community = await database.getNewCommunities(100);
    if (community != null) {
        res.contentType("application/json");
        res.send(community);
    } else {
        res.status(404);
        res.send();
    }
});

router.get('/0/posts', async function (req, res) {
    const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await database.getCommunityByTitleID(paramPack.title_id);
    if(community != null)
    {
        let posts;
        if(req.query.search_key)
            posts = await database.getPostsByCommunityKey(community, parseInt(req.query.limit), req.query.search_key);
        else
            posts = await database.getPostsByCommunity(community, parseInt(req.query.limit));
        /*  Build formatted response and send it off. */
        let response;
        if(req.query.with_mii === '1')
            response = await comPostGen.PostsResponseWithMii(posts, community);
        else
            response = await comPostGen.PostsResponse(posts, community);
        res.contentType("application/xml");
        res.send(response);
    }
    else
    {
        res.status(404);
        res.send();
    }
});

router.get('/:appID/posts', async function (req, res) {
    const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await COMMUNITY.findOne({ app_id: req.params.appID });
    if(!community)
        community = await database.getCommunityByTitleID(paramPack.title_id);
    if(!community)
        res.sendStatus(404);
    let query = {
        community_id: community.app_id ? community.app_id : community.community_id,
        removed: false,
    }

    if(req.query.search_key)
        query.search_key = search_key;
    if(!req.query.allow_spoiler)
        query.is_spoiler = 0;

    let posts = await POST.find(query).sort({ created_at: -1}).limit(parseInt(req.query.limit));

    /*  Build formatted response and send it off. */
    let response;
    if(req.query.with_mii === '1')
        response = await comPostGen.PostsResponseWithMii(posts, community);
    else
        response = await comPostGen.PostsResponse(posts, community);
    res.contentType("application/xml");
    res.send(response);
});

module.exports = router;
