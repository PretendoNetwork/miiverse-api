var express = require('express');
var router = express.Router();
const database = require('../../../database');
const comPostGen = require('../../../util/CommunityPostGen');
const processHeaders = require('../../../util/authentication');

/* GET post titles. */
router.get('/', function (req, res) {
    res.send(
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '    <meta charset="UTF-8">\n' +
        '    <title>3DS Miiverse</title>\n' +
        '    <style>\n' +
        '    table,th,td {\n' +
        '        border : 1px solid black;\n' +
        '        border-collapse: collapse;\n' +
        '    }\n' +
        '    th,td {\n' +
        '        padding: 5px;\n' +
        '    }\n' +
        '        body {\n' +
        '            width: 400px;\n' +
        '            font-size: 14px;\n' +
        '            font-family: sans-serif;\n' +
        '            line-height: 1.5;\n' +
        '            margin: 0;\n' +
        '            padding: 0;\n' +
        '            color: #323232;\n' +
        '            word-wrap: break-word;\n' +
        '            background: #eeeeee url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAAAAAAdwx7eAAAA4ElEQVR4Ae3Yt5LDQAwDUP7/x94SOyuqdGJl+wJY0OcA1Jo3CpsE278N8EUH+N4QLVq06Jeio5N2nnZEgV41ehXoicHTA5Om86brt03QG/Km+dvGxtELedPDHX/EfeRtY/1JR6yZ8nBQ8ZH2XHFLkxd/n19vxPhHzPCvz/gPk+E/upVmQWl+GT8JMvwEM+am+dsm6KjQUaCBvRRAtGjRokWLFi1atOjPogPoP7r3/3D0/yb1/9x1/JI2/kjXf//ZHsL4roAvLfqrlv6CqKfWaijjGirEhuJT/XU3LVq0aNFHOlH+pCn6LDkAAAAASUVORK5CYII=\');\n' +
        '            background-attachment: fixed;\n' +
        '            min-height: 460px;\n' +
        '        }\n' +
        '        .window {\n' +
        '            text-align: center;\n' +
        '        }\n' +
        '\n' +
        '        .welcome-window .window-title {\n' +
        '            padding: 0 20px 130px;\n' +
        '            height: 220px;\n' +
        '            display: -webkit-box;\n' +
        '            -webkit-box-sizing: border-box;\n' +
        '            -webkit-box-align: center;\n' +
        '            -webkit-box-pack: center;\n' +
        '            overflow: hidden;\n' +
        '            background: no-repeat center bottom #ffffff;\n' +
        '        }\n' +
        '\n' +
        '        .welcome-window .window-body {\n' +
        '            width: 290px;\n' +
        '            margin: 0 auto;\n' +
        '            padding: 0 0 22px;\n' +
        '            min-height: 240px;\n' +
        '            display: -webkit-box;\n' +
        '            -webkit-box-align: center;\n' +
        '            -webkit-box-pack: center;\n' +
        '            -webkit-box-sizing: border-box;\n' +
        '        }\n' +
        '        .welcome-window .window-body-inner {\n' +
        '            padding: 10px;\n' +
        '            background: #FFF;\n' +
        '            -webkit-border-radius: 9px;\n' +
        '            border-top: 1px solid #dddddd;\n' +
        '            border-left: 1px solid #dddddd;\n' +
        '            border-right: 1px solid #b7b7b7;\n' +
        '            border-bottom: 1px solid #b7b7b7;\n' +
        '            width: auto;\n' +
        '        }\n' +
        '\n' +
        '        #welcome-start .window-title {\n' +
        '            background-image: url(\'data:image/jpeg;base64,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\');\n' +
        '        }\n' +
        '    </style>\n' +
        '</head>\n' +
        '<body>\n' +
        '<div id="body" data-region-id="2">\n' +
        '    <div id="welcome-start" class="guest-page">\n' +
        '        <div class="window-page">\n' +
        '            <div class="window welcome-window">\n' +
        '                <div class="window-title">\n' +
        '                </div>\n' +
        '                <div class="window-body">\n' +
        '                    <div class="window-body-inner message">\n' +
        '                        <form action="" id="communitySelection"></form>\n' +
        '                        <div id="Posts"></div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
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
        '        if (str === -1) {\n' +
        '            var a = document.getElementById(\'communities\');\n' +
        '            str = a.options[a.selectedIndex].value;            console.log(str);        }\n' +
        '        xhttp = new XMLHttpRequest();\n' +
        '        xhttp.onreadystatechange = function() {\n' +
        '            if (this.readyState === 4 && this.status === 200) {\n' +
        '                document.getElementById("Posts").innerHTML = this.responseText;\n' +
        '            }\n' +
        '        };\n' +
        '        xhttp.open("GET", "/v1/posts?community_id=" + str + "&limit=100&format=1", true);\n' +
        '        xhttp.send();\n' +
        '    }\n' +
        '    getCommunities()\n' +
        '</script>\n' +
        '</body>\n' +
        '</html>'
    )
});

module.exports = router;