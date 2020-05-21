var express = require('express');
var router = express.Router();
const database = require('../../../database');
var multer  = require('multer');
const snowflake = require('node-snowflake').Snowflake;
const consts = require('../../../consts.json');
const { COMMUNITY } = require('../../../models/communities');
let PNG = require('pngjs').PNG;
// configure multer
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

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
            body += '<option id=' + community[i].community_id + ' name=' + community[i].title_id[0] + ' value=' + community[i].community_id + '>' + community[i].name + '</option>';
        }
        body += '    </select> </form>';
        body += '<button type="button" onClick="getPosts(-1)">Refresh Table</button>';
        res.send('<!DOCTYPE html>'
            + '<html><head>' + '</head><body>' + body + '</body></html>');

    });
});
router.get('/images', function (req, res) {
    database.connect().then(async e => {
        let community = await database.getCommunityByID(req.query.community_id);
        let response = {
            name: community.name,
            description: community.description,
            platform_id: community.platform_id,
            CTR_browser_header: community.CTR_browser_header,
            WiiU_browser_header: community.WiiU_browser_header,
            browser_icon: community.browser_icon
        };
        res.send(response);

    });
});
router.get('/uploads/*', function (req, res) {
    let fileName = req.originalUrl.replace('/v1/communities/uploads/', '').trim();
    res.sendFile(fileName, { root: './uploads/' });
});
router.post('/new', upload.fields([{name: 'browserIcon', maxCount: 1}, { name: 'CTRbrowserHeader', maxCount: 1}, { name: 'WiiUbrowserHeader', maxCount: 1}]), async function (req, res, next) {
    const files = JSON.parse(JSON.stringify(req.files));
    const document = {
        empathy_count: 0,
        id: snowflake.nextId(),
        has_shop_page: req.body.has_shop_page,
        platform_id: req.body.platform_ID,
        icon: req.body.icon,
        title_ids: req.body.title_ids,
        title_id: req.body.title_ids,
        community_id: snowflake.nextId(),
        is_recommended: req.body.is_recommended,
        name: req.body.name,
        browser_icon: `data:image/png;base64,${req.files.browserIcon[0].buffer.toString('base64')}`,
        CTR_browser_header: `data:image/png;base64,${req.files.CTRbrowserHeader[0].buffer.toString('base64')}`,
        WiiU_browser_header:  `data:image/png;base64,${req.files.WiiUbrowserHeader[0].buffer.toString('base64')}`,
        description: req.body.description,
    };
    const newCommunity = new COMMUNITY(document);
    newCommunity.save();
    res.sendStatus(200)

});

module.exports = router;