var express = require('express');
var router = express.Router();
const database = require('../../../database');
const consts = require('../../../consts.json');

router.get('/', function (req, res) {
    database.connect().then(async e => {
        /*  Parse out parameters from URL and headers */
        //const paramPack = processHeaders.data.decodeParamPack(req.headers["x-nintendo-parampack"]);
        //"[0:1]=1407375153523200"
        let community = await database.getCommunityByID(req.query.community_id);
        let posts = await database.getPostsByCommunity(community, parseInt(req.query.limit));
        let formatType = parseInt(req.query.format);
        let body = '';
        let platformIDTag = '';
        switch(parseInt(community.platform_id))
        {
            case 0:
                platformIDTag = consts.Wii_U_Platform_Tag;
                break;
            case 1:
                platformIDTag = consts.CTR_Platform_Tag;
                break;
            case 2:
                platformIDTag = consts.Both_Platform_Tag;
                break;
        }
        switch(formatType)
        {
            case 0:
                body = '<table id="posts"><tbody><tr>' +
                    '<th>Icon</th>' +
                    '<th>Description</th></tr>' +
                    '<tr><td><img src="' + community.browser_icon + '" width=auto height=auto></td>' +
                    '<td>' + community.description +'</td></tr>' +
                    '<th>Screen Name</th>' +
                    '<th>Body Text</th>' +
                    '<th>Yeah Count</th>' +
                    '<th>Painting</th>' +
                    '</tr>';
                for(let i = 0; i < posts.length; i++)
                {
                    let paintingURI;
                    if(posts[i].painting_uri === undefined)
                        paintingURI = consts.No_Painting;
                    else
                        paintingURI = posts[i].painting_uri;
                    let postBody;
                    if(posts[i].body === undefined)
                        postBody = 'No text';
                    else
                        postBody = posts[i].body;
                    body += '<tr id="' + posts[i].id + '">' + '<td><a href="/users/' + posts[i].pid +  '">' + posts[i].screen_name + '</a></td>' +
                        '<td>'  + '<a href="/posts/' + posts[i].id +  '">' + postBody + '</a></td>' +
                        '<td>' + posts[i].empathy_count + '</td>' +
                        '<td><img src="' + paintingURI + '" width=auto height=auto></td>';
                }
                body += '</tbody>' + '</table>';
                res.send('<!DOCTYPE html>'
                    + '<html><head>' + '</head><body>' + body + '</body></html>');
                break;
            case 1:
                body =
                    '<table id="posts"><tbody><tr>' +
                    '<th><img src="' + community.browser_icon + '" width="50%" height=auto></th>' +
                    '<th><img src="' + platformIDTag + '" width=auto height="75%"></th>' +
                    '</tr>';
                for(let i = 0; i < posts.length; i++)
                {
                    let postBody = '';
                    if(posts[i].painting_uri === undefined && posts[i].body !== undefined)
                        postBody = '<td colspan="2">'  + '<a>' + posts[i].body + '</a></td>';
                    else if(posts[i].painting_uri !== undefined && posts[i].body === undefined)
                        postBody = '<td colspan="2"><img src="' + posts[i].painting_uri + '" width=auto height="75%"></td>';
                    else
                        postBody = '<td colspan="2">'  + '<a href="/posts/' + posts[i].id +  '">No Data</a></td>';

                    body += '<tr id="' + posts[i].id + '">' + '<td><a href="/users/' + posts[i].pid +  '">' + posts[i].screen_name + '</a></td>' +
                        '<td>Yeah: ' + posts[i].empathy_count + '</td>' +
                         '<tr>' + postBody + '</tr>';
                }
                body += '</tbody>' + '</table>';
                res.send('<!DOCTYPE html>'
                    + '<html><head>' + '</head><body>' + body + '</body></html>');
                break;
            case 2:
                let response = [];
                for(let i = 0; i < posts.length; i++)
                {
                    response.push(posts[i]);
                }
                res.send(JSON.stringify(response));
                break;
        }
    });
});

router.get('/*', function (req, res) {
    let post_id = req.originalUrl.replace('/posts/', '').trim();
    database.connect().then(async emp => {
        const post = await database.getPostByID(post_id);
        let post_body;
        if(post.body === undefined)
            post_body = 'No Text';
        else
            post_body = post.body;
        let post_painting_uri;
        if(post.painting_uri === undefined)
            post_painting_uri = consts.No_Painting;
        else
            post_painting_uri = post.painting_uri;
        let body =
            '<style>\n' +
            '    table,th,td {\n' +
            '        border : 1px solid black;\n' +
            '        border-collapse: collapse;\n' +
            '    }\n' +
            '    th,td {\n' +
            '        padding: 5px;\n' +
            '    }\n' +
            '</style>\n' +
            '<table id="posts"><tbody><tr>' +
            '<th>Screen Name</th>' +
            '<th>Body Text</th>' +
            '<th>Yeah Count</th>' +
            '<th>Painting</th>' +
            '</tr>' +
            '<tr id="' + post.id + '">' + '<td><a href="/users/' + post.pid +  '">' + post.screen_name + '</a></td>' +
            '<td>' + post_body + '</td>' +
            '<td>' + post.empathy_count + '</td>' +
            '<td><img src="' + post_painting_uri + '" width=auto height=auto></td>' +
            '</tbody>' + '</table>';
        res.send('<!DOCTYPE html>'
            + '<html><head>' + '</head><body>' + body + '</body></html>');
    });
});

module.exports = router;