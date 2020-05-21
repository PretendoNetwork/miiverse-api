const express = require('express');
const subdomain = require('express-subdomain');
const logger = require('../../logger');
const routes = require('./routes');
const bodyParser = require('body-parser');

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const api = express.Router();
const portal = express.Router();

// Create subdomains
logger.info('[MIIVERSE] Creating \'web api\' subdomain');
router.use(subdomain('web.olv', api));
router.use(subdomain('ctr.olv', api));
router.use(subdomain('portal.olv', portal));

// Setup routes
api.use('/', routes.WEB);
api.use('/titles/show', routes.CTR);
portal.use('/titles/', routes.PORTAL);
portal.use('/v1/communities/', routes.COMMUNITY);
portal.use('/v1/posts/', routes.POST);
portal.use('/posts', routes.NEWPOST);
portal.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/posts/', routes.POST);
api.use('/posts/', routes.POST);
api.use('/users/', routes.USERS);
portal.use('/users/', routes.USERS);

module.exports = router;