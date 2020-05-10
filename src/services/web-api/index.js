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

// Setup routes
api.use('/', routes.PORTAL);
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/post/', routes.POST);

module.exports = router;