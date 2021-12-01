var express = require('express');
var router = express.Router();
const database = require('../../../database');
const pplPostGen = require('../../../util/peoplePostGen');
const processHeaders = require('../../../util/util');

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

module.exports = router;
