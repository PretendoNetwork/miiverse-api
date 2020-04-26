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
const portal = express.Router();
const ctr = express.Router();

// Create subdomains
logger.info('[MIIVERSE] Creating \'discovery\' subdomain');
router.use(subdomain('discovery.olv', discovery));
logger.info('[MIIVERSE] Creating \'api\' subdomain');
router.use(subdomain('api.olv', api));

logger.info('[MIIVERSE] Creating \'portal\' subdomain');
router.use(subdomain('portal.olv', portal));
router.use(subdomain('ctr.olv', ctr));

logger.info('[MIIVERSE] Importing middleware');
discovery.use(sessionMiddleware);
discovery.use(pnidMiddleware);

// Setup routes
discovery.use('/v1/endpoint', routes.DISCOVERY);
api.use('/v1/posts', routes.POST);
ctr.use('/', routes.CTR);

module.exports = router;