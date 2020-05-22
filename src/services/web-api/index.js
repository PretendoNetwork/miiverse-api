const express = require('express');
const subdomain = require('express-subdomain');
const logger = require('../../logger');
const routes = require('./routes');

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
api.use('/web', routes.WEB);
api.use('/titles/show', routes.CTR);
portal.use('/', routes.PORTAL);
portal.use('/v1/communities/', routes.COMMUNITY);
portal.use('/v1/posts/', routes.POST);
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/posts/', routes.POST);
api.use('/post/', routes.POST);
api.use('/users/', routes.USERS);
portal.use('/users/', routes.USERS);

module.exports = router;