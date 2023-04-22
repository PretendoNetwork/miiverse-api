import express from 'express';
import multer from 'multer';
import {
    getSubCommunities,
    getMostPopularCommunities,
    getNewCommunities,
    getCommunityByTitleID,
    getUserContent,
    getCommunityByTitleIDs
} from '@/database';
import comPostGen from '@/util/xmlResponseGenerator';
import { decodeParamPack } from '@/util';
import { Community } from "@/models/community";
import { Post } from "@/models/post";

const router = express.Router();

/* GET post titles. */
router.get('/', async function (req, res) {
    const paramPack = decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await getCommunityByTitleID(paramPack.title_id);
    if(!community) res.sendStatus(404);

    let communities = await getSubCommunities(community.olive_community_id);
    if(!communities) res.sendStatus(404);
    communities.unshift(community);
    let response = await comPostGen.Communities(communities);
    res.contentType("application/xml");
    res.send(response);
});

router.get('/popular', async function (req, res) {
    let community = await getMostPopularCommunities(100);
    if (community != null) {
        res.contentType("application/json");
        res.send(community);
    } else res.sendStatus(404);
});

router.get('/new', async function (req, res) {
    let community = await getNewCommunities(100);
    if (community != null) {
        res.contentType("application/json");
        res.send(community);
    } else res.sendStatus(404);
});

router.get('/:appID/posts', async function (req, res) {
    const paramPack = decodeParamPack(req.headers["x-nintendo-parampack"]);
    let community = await Community.findOne({ community_id: req.params.appID });
    if(!community)
        community = await getCommunityByTitleID(paramPack.title_id);
    if(!community)
        res.sendStatus(404);
    let query = {
        community_id: community.olive_community_id,
        removed: false,
        app_data: { $ne: null },
        message_to_pid: { $eq: null },
        search_key: null,
        is_spoiler: null,
        painting: null,
        pid: null
    }

    if(req.query.search_key)
        query.search_key = req.query.search_key;
    if(!req.query.allow_spoiler)
        query.is_spoiler = 0;
    //TODO: There probably is a type for text and screenshots too, will have to investigate
    if(req.query.type === 'memo')
        query.painting = { $ne: null };
    if(req.query.by === 'followings') {
        let userContent = await getUserContent(req.pid);
        query.pid = userContent.following_users;
    }
    else if(req.query.by === 'self')
        query.pid = req.pid;

    let posts;
    if(req.query.distinct_pid === '1')
        posts = await Post.aggregate([
            { $match: query }, // filter based on input query
            { $sort: { created_at: -1 } }, // sort by 'created_at' in descending order
            { $group: { _id: '$pid', doc: { $first: '$$ROOT' } } }, // remove any duplicate 'pid' elements
            { $replaceRoot: { newRoot: '$doc' } }, // replace the root with the 'doc' field
            { $limit: (req.query.limit ? Number(req.query.limit) : 10) } // only return the top 10 results
        ]);
    else
        posts = await Post.find(query).sort({ created_at: -1}).limit(parseInt(req.query.limit as string));

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

// Handler for POST on '/v1/communities'
router.post('/', multer().none(), async function (req, res) {
    const paramPack = decodeParamPack(req.headers["x-nintendo-parampack"]);
    let parent_community = await getCommunityByTitleIDs(paramPack.title_id);
    if(!parent_community) res.sendStatus(404);

    let num_communities = await Community.count();
    let new_community = new Community({
        platform_id: 0, // WiiU
        name: req.body.name,
        description: req.body.description,
        open: true,
        allows_comments: true,
        type: 1,
        parent: parent_community.community_id,
        admins: parent_community.admins,
        icon: req.body.icon,
        title_id: paramPack.title_id,
        community_id: (parseInt(parent_community.community_id) + (5000 * num_communities)).toString(),
        olive_community_id: (parseInt(parent_community.community_id) + (5000 * num_communities)).toString(),
        app_data: req.body.app_data.replace(/[^A-Za-z0-9+/=\s]/g, ""),
    });

    await new_community.save();

    let response = await comPostGen.Community(new_community);
    res.contentType("application/xml");
    res.send(response);
});

export default router;
