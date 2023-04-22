import express from 'express';
import xmlGenerator from '@/util/xmlResponseGenerator';
import { getUserContent, getFollowedUsers } from '@/database';
import { getFriends } from '@/util';
import { Post } from "@/models/post";

const router = express.Router();

/* GET post titles. */
router.get('/', async function (req, res) {
    let userContent = await getUserContent(req.pid);
    if(!userContent) return res.sendStatus(404);
    let query = {
        removed: false,
        is_spoiler: 0,
        app_data: { $eq: null },
        parent: { $eq: null },
        message_to_pid: { $eq: null },
        pid: null
    }

    if(req.query.relation === 'friend') {
        let friends = await getFriends(req.pid);
        if(!friends) return res.sendStatus(204);
        query.pid = { $in: friends.pids };
    }
    else if(req.query.relation === 'following') {
        query.pid = { $in: userContent.followed_users.map(i=>Number(i)) };
    }
    else if(req.query.pid) {
        query.pid = { $in: (req.query.pid as string[]).map(i=>Number(i)) }
    }
    let posts;
    if(req.query.distinct_pid === '1')
        posts = await Post.aggregate([
            { $match: query }, // filter based on input query
            { $sort: { created_at: -1 } }, // sort by 'created_at' in descending order
            { $group: { _id: '$pid', doc: { $first: '$$ROOT' } } }, // remove any duplicate 'pid' elements
            { $replaceRoot: { newRoot: '$doc' } }, // replace the root with the 'doc' field
            { $limit: (req.query.limit ? Number(req.query.limit) : 10) } // only return the top 10 results
        ]);
    else if(req.query.is_hot === '1')
        posts = await Post.find(query).sort({ empathy_count: -1}).limit(parseInt(req.query.limit as string));
    else
        posts = await Post.find(query).sort({ created_at: -1}).limit(parseInt(req.query.limit as string));

    /*  Build formatted response and send it off. */
    let options = {
        name: 'posts',
        with_mii: req.query.with_mii === '1',
        topic_tag: true
    }
    res.contentType("application/xml");
    res.send(await xmlGenerator.People(posts, options));
});

router.get('/:pid/following', async function (req, res) {
    let user = await getUserContent(req.params.pid);
    if(!user) res.sendStatus(404);
    let people = await getFollowedUsers(user);
    if(!people) res.sendStatus(404);
    res.send(await xmlGenerator.Following(people));
});

export default router;