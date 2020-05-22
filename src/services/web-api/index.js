const express = require('express');
const subdomain = require('express-subdomain');
const logger = require('../../logger');
const routes = require('./routes');

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const api = express.Router();
const web = express.Router();
const ctr = express.Router();
const portal = express.Router();

// Create subdomains
logger.info('[MIIVERSE] Creating \'web api\' subdomain');
router.use(subdomain('web.olv', web));
router.use(subdomain('ctr.olv', ctr));
router.use(subdomain('portal.olv', portal));

// Setup routes
web.use('/', routes.WEB);
ctr.use('/titles/show', routes.CTR);
portal.use('/', routes.PORTAL);
portal.use('/v1/communities/', routes.COMMUNITY);
portal.use('/v1/posts/', routes.POST);
portal.use('/post', routes.NEWPOST);
web.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/posts/', routes.POST);
api.use('/post', routes.NEWPOST);
api.use('/users/', routes.USERS);
portal.use('/users/', routes.USERS);

module.exports = router;