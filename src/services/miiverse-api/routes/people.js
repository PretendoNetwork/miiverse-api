const express = require('express');
const router = express.Router();
const database = require('../../../database');
const xmlGenerator = require('../../../util/xmlResponseGenerator');
const {POST} = require("../../../models/post");
const comPostGen = require("../../../util/xmlResponseGenerator");

/* GET post titles. */
router.get('/', async function (req, res) {
    let userContent = await database.getUserContent(req.pid);

    let query = {
        removed: false,
        is_spoiler: 0,
        app_data: { $eq: null },
        parent: { $eq: null },
        message_to_pid: { $eq: null }
    }

    if(req.query.relation === 'friend') {
        query.pid = { $in: userContent.following_users.map(i=>Number(i)) };
    }
    else if(req.query.relation === 'following') {
        query.pid = { $in: userContent.followed_users.map(i=>Number(i)) };
    }
    else if(req.query.pid) {
        query.pid = { $in: req.query.pid.map(i=>Number(i)) }
    }
    let posts;
    if(req.query.distinct_pid === '1')
        posts = await POST.aggregate([
            { $match: query }, // filter based on input query
            { $sort: { created_at: -1 } }, // sort by 'created_at' in descending order
            { $group: { _id: '$pid', doc: { $first: '$$ROOT' } } }, // remove any duplicate 'pid' elements
            { $replaceRoot: { newRoot: '$doc' } }, // replace the root with the 'doc' field
            { $limit: (req.query.limit ? Number(req.query.limit) : 10) } // only return the top 8 results
        ]);
    else if(req.query.is_hot === '1')
        posts = await POST.find(query).sort({ empathy_count: -1}).limit(parseInt(req.query.limit));
    else
        posts = await POST.find(query).sort({ created_at: -1}).limit(parseInt(req.query.limit));

    /*  Build formatted response and send it off. */
    let options = {
        name: 'posts',
        with_mii: req.query.with_mii === '1'
    }
    res.contentType("application/xml");
    res.send(await comPostGen.People(posts, options));
});

router.get('/:pid/following', async function (req, res) {
    let user = await database.getUserContent(req.params.pid);
    if(!user) res.sendStatus(404);
    let people = await database.getFollowedUsers(user);
    if(!people) res.sendStatus(404);
    res.send(await xmlGenerator.Following(people));
});

module.exports = router;
