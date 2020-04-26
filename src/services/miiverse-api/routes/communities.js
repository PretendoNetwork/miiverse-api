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
        console.log(paramPack.title_id);
        let community = await database.getCommunityByTitleID(paramPack.title_id);
        console.log(community.title_id);
        /*  Go to the database for posts. */
        let posts = await database.getPostsByCommunity(community, parseInt(req.query.limit));
        console.log(posts);

        /*  Build formatted response and send it off. */
        let response = await comPostGen.PostsResponse(posts, community);
        res.contentType("application/xml");
        res.send(response);
    });
});

module.exports = router;