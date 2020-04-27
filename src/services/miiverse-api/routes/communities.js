var express = require('express');
var router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/processHeaders');

/* GET post titles. */
router.get('/0/posts', function (req, res) {
    database.connect().then(async e => {
        /*  Parse out parameters from URL and headers */
        const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
        //"[0:1]=1407375153523200"
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
            if(req.query.with_mii === 1)
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
});

module.exports = router;