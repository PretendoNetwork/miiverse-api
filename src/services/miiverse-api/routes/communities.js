const express = require('express');
const router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/xmlResponseGenerator');
const util = require('../../../util/util');
const {COMMUNITY} = require("../../../models/communities");
const {POST} = require("../../../models/post");

/* GET post titles. */
router.get('/', async function (req, res) {
    const paramPack = util.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await database.getCommunityByTitleID(paramPack.title_id);
    if(!community) res.sendStatus(404);

    let communities = await database.getSubCommunities(community.olive_community_id);
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
    } else res.sendStatus(404);
});

router.get('/new', async function (req, res) {
    let community = await database.getNewCommunities(100);
    if (community != null) {
        res.contentType("application/json");
        res.send(community);
    } else res.sendStatus(404);
});

router.get('/:appID/posts', async function (req, res) {
    const paramPack = util.decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await COMMUNITY.findOne({ community_id: req.params.appID });
    if(!community)
        community = await database.getCommunityByTitleID(paramPack.title_id);
    if(!community)
        res.sendStatus(404);
    let query = {
        community_id: community.olive_community_id,
        removed: false,
        app_data: { $ne: null },
        message_to_pid: { $eq: null }
    }

    if(req.query.search_key)
        query.search_key = req.query.search_key;
    if(!req.query.allow_spoiler)
        query.is_spoiler = 0;
    //TODO: There probably is a type for text and screenshots too, will have to investigate
    if(req.query.type === 'memo')
        query.painting = { $ne: null };
    if(req.query.by === 'followings') {
        let userContent = await database.getUserContent(req.pid);
        query.pid = userContent.following_users;
    }
    else if(req.query.by === 'self')
        query.pid = req.pid;

    let posts;
    if(req.query.distinct_pid === '1')
        posts = await POST.aggregate([
            { $match: query }, // filter based on input query
            { $sort: { created_at: -1 } }, // sort by 'created_at' in descending order
            { $group: { _id: '$pid', doc: { $first: '$$ROOT' } } }, // remove any duplicate 'pid' elements
            { $replaceRoot: { newRoot: '$doc' } }, // replace the root with the 'doc' field
            { $limit: (req.query.limit ? Number(req.query.limit) : 10) } // only return the top 10 results
        ]);
    else
        posts = await POST.find(query).sort({ created_at: -1}).limit(parseInt(req.query.limit));

    /*  Build formatted response and send it off. */
    let options = {
        name: 'posts',
        with_mii: req.query.with_mii === '1',
        app_data: true,
        topic_tag: true
    }
    res.contentType("application/xml");
    res.send(await comPostGen.PostsResponse(posts, community, options));
});

module.exports = router;
