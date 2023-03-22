const express = require('express');
const router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
let memoize = require("memoizee");
memoized = memoize(comPostGen.topics, { async: true, maxAge: 1000 * 60 * 60 });

/* GET post titles. */
router.get('/', async function (req, res) {
    let communities = await database.getMostPopularCommunities(10);
    if(communities === null)
        return res.sendStatus(404);
    let response = await memoized(communities);
    res.contentType("application/xml");
        res.send(response);
});

module.exports = router;
