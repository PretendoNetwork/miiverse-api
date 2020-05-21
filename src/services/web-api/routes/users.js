var express = require('express');
var router = express.Router();
const database = require('../../../database');
const consts = require('../../../consts.json');

router.get('/*/check_can_post.json', function (req, res) {
    res.send({"success":1,"remaining_today_posts":30});
});
router.get('/*', function (req, res) {
    database.connect().then(async e => {
        let PID = req.originalUrl.replace('/users/', '').trim();
        let posts = await database.getPostsByUserID(PID);
        let userPosts = '';
        let totalEmpathy = 0;
        for(let i = 0; i < posts.length; i++)
        {
            totalEmpathy += posts[i].empathy_count;
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
            userPosts +=  '<tr id="' + posts[i].id + '">' + '<td><a href="/posts/' + posts[i].id +  '">' + postBody + '</a></td>' +
                '<td>' + posts[i].empathy_count + '</td>' +
                '<td><img src="' + paintingURI + '" width=auto height=auto></td>';
        }
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
            '<tr>' +
            '<th>User Name</th>' +
            '<th>Total Yeah!</th>' +
            '</tr>\n<tr>' +
            '<td>' + posts[0].screen_name + '</td>' +
            '<td>' + totalEmpathy + '</td></tr>' +
            '<th>Body Text</th>' +
            '<th>Yeah Count</th>' +
            '<th>Painting</th>' +
            '</tr>';
        body += userPosts + '</tbody></table>';
        res.send('<!DOCTYPE html>'
            + '<html><head>' + '</head><body>' + body + '</body></html>');

    });
});


module.exports = router;