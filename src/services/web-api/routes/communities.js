var express = require('express');
var router = express.Router();
const database = require('../../../database');
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

module.exports = router;