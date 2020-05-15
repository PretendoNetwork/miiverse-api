var express = require('express');
var router = express.Router();
const database = require('../../../database');

router.get('/', function (req, res) {
    database.connect().then(async e => {
        /*  Parse out parameters from URL and headers */
        //const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
        //"[0:1]=1407375153523200"
        let community = await database.getCommunityByID(req.query.community_id);
        let posts = await database.getPostsByCommunity(community, parseInt(req.query.limit));
        let body = '<table id="posts"><tbody><tr>' +
            '<th onClick="sortTable(0)">Screen Name</th>' +
            '<th onClick="sortTable(1)">Body Text</th>' +
            '<th onClick="sortTable(2)">Yeah Count</th>' +
            '<th onClick="sortTable(3)">Painting</th>' +
            '</tr>';
        for(let i = 0; i < posts.length; i++)
        {
            body += '<tr id="' + posts[i]._id + '_row">' + '<td>' + posts[i].screen_name + '</td>' +
                '<td>' + posts[i].body + '</td>' +
                '<td>' + posts[i].empathy_count + '</td>' +
                '<td><img src="' + posts[i].painting_uri + '" width=auto height=auto></td>';
        }
        body += '</tbody>' + '</table>';
        res.send('<!DOCTYPE html>'
            + '<html><head>' + '</head><body>' + body + '</body></html>');

    });
});

module.exports = router;