import express from 'express';
import memoize from 'memoizee';
import { getPNID, getEndPoint } from '@/database';
import { Post } from '@/models/post';
import { Community } from '@/models/community';
import comPostGen from '@/util/xmlResponseGenerator';

const router = express.Router();

const memoized = memoize(comPostGen.topics, { async: true, maxAge: 1000 * 60 * 60 });

/* GET post titles. */
router.get('/', async function (req, res) {
    let user = await getPNID(req.pid), discovery;
    if(user)
        discovery = await getEndPoint(user.server_access_level);
    else
        discovery = await getEndPoint('prod');
    if(!discovery.topics) return res.sendStatus(404);

    let communities = await calculateMostPopularCommunities(24, 10);
    if(communities === null || communities.length < 10) return res.sendStatus(404);

    let response = await memoized(communities);
    res.contentType("application/xml");
        res.send(response);
});

async function calculateMostPopularCommunities(hours, limit) {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - hours * 60 * 60 * 1000);
    const posts = await Post.find({ created_at: { $gte: last24Hours },  message_to_pid: null });
    if(!posts) return;
    const communityIds = {};
    for (const post of posts) {
        const communityId = post.community_id;
        communityIds[communityId] = (communityIds[communityId] || 0) + 1;
    }
    const communities = Object.entries(communityIds)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .map((entry) => entry[0]);
    if(communities.length < limit)
        return Community.find().limit(limit).sort({followers: -1});

    let response = await Community.aggregate([
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

export default router;
