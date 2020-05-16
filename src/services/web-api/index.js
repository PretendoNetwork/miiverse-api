const express = require('express');
const subdomain = require('express-subdomain');
const sessionMiddleware = require('../../middleware/session');
const pnidMiddleware = require('../../middleware/pnid');
const logger = require('../../logger');
const routes = require('./routes');

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const api = express.Router();

// Create subdomains
logger.info('[MIIVERSE] Creating \'web api\' subdomain');
router.use(subdomain('web.olv', api));
router.use(subdomain('ctr.olv', api));
router.use(subdomain('portal.olv', api));

// Setup routes
api.use('/', routes.PORTAL);
api.use('/titles/show', routes.PORTAL);
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/posts/', routes.POST);
api.use('/posts/', routes.POST);
api.use('/users/', routes.USERS);

module.exports = router;