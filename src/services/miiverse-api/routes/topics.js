const express = require('express');
const router = express.Router();
const database = require('../../../database');
const {POST} = require('../../../models/post');
const {COMMUNITY} = require('../../../models/communities');
const comPostGen = require('../../../util/xmlResponseGenerator');
let memoize = require("memoizee");
memoized = memoize(comPostGen.topics, { async: true, maxAge: 1000 * 60 * 60 });

/* GET post titles. */
router.get('/', async function (req, res) {
    let user = await database.getPNID(req.pid), discovery;
    if(user)
        discovery = await database.getEndPoint(user.server_access_level);
    else
        discovery = await database.getEndPoint('prod');
    if(!discovery.topics) return res.sendStatus(404);

    let communities = await calculateMostPopularCommunities(24, 10);
    if(communities === null) return res.sendStatus(404);

    let response = await memoized(communities);
    res.contentType("application/xml");
        res.send(response);
});

async function calculateMostPopularCommunities(hours, limit) {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - hours * 60 * 60 * 1000);

    const posts = await POST.find({ created_at: { $gte: last24Hours },  message_to_pid: null }).lean();

    const communityIds = {};
    for (const post of posts) {
        const communityId = post.community_id;
        communityIds[communityId] = (communityIds[communityId] || 0) + 1;
    }
    const communities = Object.entries(communityIds)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);
    if(communities.size < limit)
        return calculateMostPopularCommunities(hours + hours, limit);

    let response = await COMMUNITY.aggregate([
        { $match: { olive_community_id: { $in: communities }, parent: null } },
        {$addFields: {
                index: { $indexOfArray: [ communities, "$olive_community_id" ] }
            }},
        { $sort: { index: 1 } },
        { $limit : limit },
        { $project: { index: 0, _id: 0 } }
    ]);
    if(response.length < limit)
        return calculateMostPopularCommunities(hours + hours, limit);
    else return response;
}

module.exports = router;
