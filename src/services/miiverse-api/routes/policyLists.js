var express = require('express');
var router = express.Router();
const xmlbuilder = require("xmlbuilder");
var multer  = require('multer');
var upload = multer();

router.get('/policylist/1/1/US', upload.none(), async function (req, res, next) {
    let xml = xmlbuilder.create("result")
        .e("has_error", "0").up()
        .e("version", "1").up()
        .e("request_name", "posts").up()
        .e("topic")
        .e("community_id", community.community_id).up()
        .up()
        .e("posts");
        let response = {
            MajorVersion: 1,
            MinorVersion: 0,
            ListId: 1924,
            DefaultStop: false,
            ForceVersionUp: true,
            UpdateTime: '2020-03-03T02:51:02+0000',
            Priority: {
                TitleId: '0005003010016000',
                TaskId: 'olvinfo',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '0005003010016100',
                TaskId: 'olvinfo',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '0005003010016200',
                TaskId: 'olvinfo',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500301001600a',
                TaskId: 'olv1',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500301001610a',
                TaskId: 'olv1',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500301001620a',
                TaskId: 'olv1',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '0005001010040000',
                TaskId: 'oltopic',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '0005001010040100',
                TaskId: 'oltopic',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '0005001010040200',
                TaskId: 'oltopic',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500101005a000',
                TaskId: 'Chat',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500101005a100',
                TaskId: 'Chat',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500101005a200',
                TaskId: 'Chat',
                Level: 'EXPEDITE',
            },
            Priority: {
                TitleId: '000500101004c100',
                TaskId: 'plog',
                Level: 'EXPEDITE',
            },
        };
    res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
});

module.exports = router;