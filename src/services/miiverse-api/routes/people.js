const express = require('express');
const router = express.Router();
const database = require('../../../database');
const pplPostGen = require('../../../util/peoplePostGen');

/* GET post titles. */
router.get('/', async function (req, res) {
    let community = await database.getCommunityByTitleID(1407375153321472);
    if(community != null)
    {
        let posts;
        if(req.query.search_key)
            posts = await database.getPostsByCommunityKey(community, parseInt(req.query.limit), req.query.search_key);
        else
            posts = await database.getPostsByCommunity(community, parseInt(req.query.limit));

        /*  Build formatted response and send it off. */
        let response;
        if(req.query.with_mii === 1)
            response = await pplPostGen.PostsResponseWithMii(posts, community);
        else
            response = await pplPostGen.PostsResponse(posts, community);
        res.contentType("application/xml");
        res.send(response);
    }
    else
    {
        res.status(404);
        res.send();
    }
});

router.get('/:pid/following', async function (req, res) {
    let user = await database.getUserContent(req.params.pid);
    if(!user) res.sendStatus(404);
    let people = await database.getFollowedUsers(user);
    if(!people) res.sendStatus(404);
    res.send(await pplPostGen.People(people));
});

module.exports = router;
