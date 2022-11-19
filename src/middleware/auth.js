const config = require('../../config.json');
const util = require('../util/util');
const xml = require("object-to-xml");

function auth(req, res, next) {
    if(req.path.includes('/topics') || req.path.includes('/v1/status'))
        return next();
    const token = req.headers["x-nintendo-servicetoken"] || req.headers['olive service token'];
    let paramPackData = req.headers["x-nintendo-parampack"];

    if(paramPackData)
        paramPackData = paramPackData = util.data.decodeParamPack(paramPackData);
    else if(req.path.includes('/users/'))
        return next();

    if(!token || !paramPackData && req.path.includes('/v1/endpoint'))
        return next();

    if(!token || !paramPackData)
        badAuth(res);
    else {
        const pid = util.data.processServiceToken(token);

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
