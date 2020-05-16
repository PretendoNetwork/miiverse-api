var express = require('express');
var router = express.Router();
const database = require('../../../database');
var multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
var upload = multer();
const { COMMUNITY } = require('../../../models/communities');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/list', function (req, res) {
    database.connect().then(async e => {
        /*  Parse out parameters from URL and headers */
        //const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
        //"[0:1]=1407375153523200"
        let community = await database.getCommunities(5);
        let body = '<form action="">\n' +
            '    <select id="communities" onchange="getPosts(this.value)">' +
            '        <option value="">Select a community:</option>\n';
        for(let i = 0; i < community.length; i++)
        {
            body += '<option value=' + community[i].community_id + '>' + community[i].name + '</option>';
        }
        body += '    </select> </form>';
        body += '<button type="button" onClick="getPosts(-1)">Refresh Table</button>';
        res.send('<!DOCTYPE html>'
            + '<html><head>' + '</head><body>' + body + '</body></html>');

    });
});
router.post('/new', upload.none(), async function (req, res, next) {
    const document = {
        empathy_count: 0,
        id: snowflake.nextId(),
        has_shop_page: req.body.has_shop_page,
        icon: req.body.icon,
        title_ids: req.body.title_ids,
        title_id: req.body.title_ids,
        community_id: snowflake.nextId(),
        is_recommended: req.body.is_recommended,
        name: req.body.name,
        browser_icon: req.body.browser_icon[0],
        browser_header: req.body.browser_header,
        description: req.body.description,
    };
    const newCommunity = new COMMUNITY(document);
    newCommunity.save();
    res.sendStatus(200)

});

module.exports = router;