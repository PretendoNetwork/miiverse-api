var express = require('express');
var router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/', function (req, res) {
    res.send(
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<style>\n' +
        '    table,th,td {\n' +
        '        border : 1px solid black;\n' +
        '        border-collapse: collapse;\n' +
        '    }\n' +
        '    th,td {\n' +
        '        padding: 5px;\n' +
        '    }\n' +
        '</style>\n' +
        '<body>\n' +
        '<h1>Miiverse Temp Admin Pannel</h1>\n' +
        '\n' +
        '<form action="" id="communitySelection">\n' +
        '</form>\n' +
        '<br>\n' +
        '<div id="Posts"></div>\n' +
        '\n' +
        '<script>\n' +
        '    function getCommunities() {\n' +
        '        var xhttp;\n' +
        '        xhttp = new XMLHttpRequest();\n' +
        '        xhttp.onreadystatechange = function() {\n' +
        '            if (this.readyState === 4 && this.status === 200) {\n' +
        '                document.getElementById("communitySelection").innerHTML = this.responseText;\n' +
        '            }\n' +
        '        };\n' +
        '        xhttp.open("GET", "/v1/communities/list", true);\n' +
        '        xhttp.send();\n' +
        '    }\n' +
        '    function getPosts(str) {\n' +
        '        var xhttp;\n' +
        '        if (str === "") {\n' +
        '            document.getElementById("Posts").innerHTML = "";\n' +
        '            return;\n' +
        '        }\n' +
        '       if (str === -1) {\n' +
        '            var a = document.getElementById(\'communities\');\n' +
        '            str = a.options[a.selectedIndex].value;' +
        '            console.log(str);' +
        '        }\n' +
        '        xhttp = new XMLHttpRequest();\n' +
        '        xhttp.onreadystatechange = function() {\n' +
        '            if (this.readyState === 4 && this.status === 200) {\n' +
        '                document.getElementById("Posts").innerHTML = this.responseText;\n' +
        '            }\n' +
        '        };\n' +
        '        xhttp.open("GET", "/v1/post?community_id=" + str + "&limit=100", true);\n' +
        '        xhttp.send();\n' +
        '    }\n' +
        'getCommunities()' +
        '</script>\n' +
        '\n' +
        '</body>\n' +
        '</html>\n'
    )
});

module.exports = router;