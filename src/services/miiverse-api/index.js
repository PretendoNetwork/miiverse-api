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
router.use(subdomain('api-test.olv', api));
router.use(subdomain('api-dev.olv', api));


logger.info('[MIIVERSE] Importing middleware');
discovery.use(sessionMiddleware);
discovery.use(pnidMiddleware);

// Setup routes
discovery.use('/v1/endpoint', routes.DISCOVERY);
api.use('/v1/posts', routes.POST);
api.use('/v1/posts.search', routes.POST);
api.use('/v1/friend_messages', routes.MESSAGE);
api.use('/v1/communities/', routes.COMMUNITY);
api.use('/v1/people/', routes.PEOPLE);
api.use('/v1/topics/', routes.TOPICS);
api.use('/v1/users/', routes.USERS);
api.use('/v1/status/', routes.PING);

module.exports = router;
