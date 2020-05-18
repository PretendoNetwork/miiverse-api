const express = require('express');
const subdomain = require('express-subdomain');
const sessionMiddleware = require('../../middleware/session');
const pnidMiddleware = require('../../middleware/pnid');
const logger = require('../../logger');
const routes = require('./routes');

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const discovery = express.Router();
const api = express.Router();

// Create subdomains
logger.info('[MIIVERSE] Creating \'discovery\' subdomain');
router.use(subdomain('discovery.olv', discovery));
logger.info('[MIIVERSE] Creating \'api\' subdomain');
router.use(subdomain('api.olv', api));
router.use(subdomain('f57cd744', discovery));


logger.info('[MIIVERSE] Importing middleware');
discovery.use(sessionMiddleware);
discovery.use(pnidMiddleware);

// Setup routes
discovery.use('/v1/endpoint', routes.DISCOVERY);
api.use('/v1/posts', routes.POST);
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/people/', routes.PEOPLE);

module.exports = router;