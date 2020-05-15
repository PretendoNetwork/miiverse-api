var express = require('express');
var xml = require('object-to-xml');
const database = require('../../../database');
const util = require('../../../util/authentication');
var router = express.Router();

/* GET discovery server. */
router.get('/', function (req, res) {
    database.connect().then(async e => {
        const discovery = await database.getDiscoveryHosts();
        try
        {
            let pid = util.data.processServiceToken(req.headers["x-nintendo-servicetoken"]);
            let usrObj;
            if(pid == null)
            {
                throw new Error('The User token was not valid');
            }
            else
            {
                usrObj = await util.data.processUser(pid);
                switch (usrObj.account_status) {
                    case 0:
                        break;
                    case 1:
                    case 2:
                    case 3:
                        res.set("Content-Type", "application/xml");
                        res.statusCode = 400;
                        response = {
                            result: {
                                has_error: 1,
                                version: 1,
                                code: 400,
                                error_code: 7,
                                message: "POSTING_FROM_NNID"
                            }
                        };
                        res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                }
            }

        }
        catch (e)
        {
            console.error(e);
        }
        switch(discovery.has_error)
        {
            case 0 :
                res.set("Content-Type", "application/xml");
                response = {
                    result: {
                        has_error: 0,
                        version: discovery.version,
                        endpoint: {
                            host: discovery.endpoint.host,
                            api_host: discovery.endpoint.api_host,
                            portal_host: discovery.endpoint.portal_host,
                            n3ds_host: discovery.endpoint.n3ds_host
                        }
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 1 :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 1,
                        message: "SYSTEM_UPDATE_REQUIRED"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 2 :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 2,
                        message: "SETUP_NOT_COMPLETE"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 3 :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 3,
                        message: "SERVICE_MAINTENANCE"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 4:
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 4,
                        message: "SERVICE_CLOSED"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 5 :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 5,
                        message: "PARENTAL_CONTROLS_ENABLED"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 6 :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 6,
                        message: "POSTING_LIMITED_PARENTAL_CONTROLS"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            case 7 :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 7,
                        message: "PNID_BANNED"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
            default :
                res.set("Content-Type", "application/xml");
                res.statusCode = 400;
                response = {
                    result: {
                        has_error: 1,
                        version: 1,
                        code: 400,
                        error_code: 15,
                        message: "SERVER_ERROR"
                    }
                };
                res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
                break;
        }

    }).catch(error => {
        res.set("Content-Type", "application/xml");
        res.statusCode = 400;
        response = {
            result: {
                has_error: 1,
                version: 1,
                code: 400,
                error_code: 15,
                message: "SERVER_ERROR"
            }
        };
        res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
    });
});

router.post('/posts', function (req, res) {
    res.sendStatus(200);
});

module.exports = router;
