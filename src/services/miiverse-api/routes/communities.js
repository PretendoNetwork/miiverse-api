var express = require('express');
var router = express.Router();
const database = require('.../database');

/* GET post titles. */
router.get('/', function (req, res) {
    /*  Parse out parameters from URL and headers */
    const communityID = parseInt(req.params[0].split('/')[0], 10);
    const paramPack = this.decodeParamPack(req.headers["x-nintendo-parampack"]);

    /*  Get community details. communityID is usually 0, for some reason. */
    let community = null;
    if (communityID === 0) {
        community = await database.getCommunityByTitleID(paramPack.title_id);
    } else {
        community = await DataStorage.getDataStorage()
            .getCommunityByID(communityID);
    }
    if (!community) {
        this.reqdie(res);
        return;
    }

    /*  Go to the database for posts. */
    const posts = await DataStorage.getDataStorage()
        .getPostsByCommunity(community, req.query.limit);
    if (!posts) {
        this.reqdie(res);
        return;
    }

    /*  Build formatted response and send it off. */
    const response = await ResponseGen.PostsResponse(posts, community);
    res.contentType("application/xml");
    res.send(response);
});

module.exports = router;