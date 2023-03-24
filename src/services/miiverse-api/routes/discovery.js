const express = require('express');
const xml = require('object-to-xml');
const database = require('../../../database');
const router = express.Router();

/* GET discovery server. */
router.get('/', async function (req, res) {
    let user = await database.getPNID(req.pid);

    let discovery;
    if(user)
        discovery = await database.getEndPoint(user.server_access_level);
    else
        discovery = await database.getEndPoint('prod');

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
});

module.exports = router;
