const express = require('express');
const subdomain = require('express-subdomain');
const sessionMiddleware = require('../../middleware/session');
const pnidMiddleware = require('../../middleware/pnid');
const logger = require('../../logger');
const routes = require('./routes');

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const miiverse = express.Router();
const portal = express.Router();

// Create subdomains
logger.info('[MIIVERSE] Creating \'discovery\' subdomain');
router.use(subdomain('discovery.olv', miiverse));

logger.info('[MIIVERSE] Creating \'portal\' subdomain');
router.use(subdomain('portal.olv', portal));
router.use(subdomain('ctr-portal.olv', portal));

logger.info('[MIIVERSE] Importing middleware');
miiverse.use(sessionMiddleware);
miiverse.use(pnidMiddleware);

// Setup routes
miiverse.use('/v1/endpoint', routes.DISCOVERY);
portal.use('/', routes.PORTAL);

module.exports = router;