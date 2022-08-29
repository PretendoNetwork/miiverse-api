const config = require('../../config.json');
const util = require('../util/util');
const xml = require("object-to-xml");

function auth(req, res, next) {
    if(req.path.includes('/topics'))
        return next();
    let token = req.headers["x-nintendo-servicetoken"];
    let paramPackData = util.data.decodeParamPack(req.headers["x-nintendo-parampack"]);

    if(!token || !paramPackData)
        badAuth(res);
    else {
        let pid = util.data.processServiceToken(token);
        if(pid === null)
            badAuth(res);
        else {
            req.pid = pid;
            req.paramPackData = paramPackData;
            return next();
        }
    }
}

function badAuth(res) {
    res.set("Content-Type", "application/xml");
    res.statusCode = 400;
    let response = {
        result: {
            has_error: 1,
            version: 1,
            code: 400,
            error_code: 7,
            message: "POSTING_FROM_NNID"
        }
    };
    return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
}

module.exports = auth;
