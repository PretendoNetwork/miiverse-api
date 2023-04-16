const config = require('../../config.json');
const util = require('../util/util');
const xml = require("object-to-xml");
const db = require("../database");

async function auth(req, res, next) {
    if(/*req.path.includes('/topics') || */req.path.includes('/v1/status'))
        return next();
    const token = req.headers["x-nintendo-servicetoken"] || req.headers['olive service token'];
    let paramPackData = req.headers["x-nintendo-parampack"];

    if(paramPackData)
        paramPackData = paramPackData = util.decodeParamPack(paramPackData);
    else if(req.path.includes('/users/'))
        return next();

    if(!token || !paramPackData && req.path.includes('/v1/endpoint'))
        return next();

    if(!token || !paramPackData)
        badAuth(res);
    else {
        const pid = util.processServiceToken(token);

        if(pid === null)
            badAuth(res);
        else {
            let user = await db.getPNID(pid), discovery;
            if(user)
                discovery = await db.getEndPoint(user.server_access_level);
            else
                discovery = await db.getEndPoint('prod');

            if(discovery.status !== 0) return serverError(res, discovery);

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

function serverError(res, discovery) {
    let message = '', error = 0;
    switch(discovery.status) {
        case 0 :
            res.set("Content-Type", "application/xml");
            let response = {
                result: {
                    has_error: 0,
                    version: 1,
                    endpoint: {
                        host: discovery.host,
                        api_host: discovery.api_host,
                        portal_host: discovery.portal_host,
                        n3ds_host: discovery.n3ds_host
                    }
                }
            };
            return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
        case 1 :
            message = 'SYSTEM_UPDATE_REQUIRED';
            error = 1;
            break;
        case 2 :
            message = 'SETUP_NOT_COMPLETE';
            error = 2;
            break;
        case 3 :
            message = 'SERVICE_MAINTENANCE';
            error = 3;
            break;
        case 4:
            message = 'SERVICE_CLOSED';
            error = 4;
            break;
        case 5 :
            message = 'PARENTAL_CONTROLS_ENABLED';
            error = 5;
            break;
        case 6 :
            message = 'POSTING_LIMITED_PARENTAL_CONTROLS';
            error = 6;
            break;
        case 7 :
            message = 'NNID_BANNED';
            error = 7;
            res.set("Content-Type", "application/xml");
            break;
        default :
            message = 'SERVER_ERROR';
            error = 15;
            res.set("Content-Type", "application/xml");
            break;
    }
    res.set("Content-Type", "application/xml");
    res.statusCode = 400;
    let response = {
        result: {
            has_error: 1,
            version: 1,
            code: 400,
            error_code: error,
            message: message
        }
    };
    res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
}

module.exports = auth;
