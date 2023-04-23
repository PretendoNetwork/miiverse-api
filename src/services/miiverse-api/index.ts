import express from 'express';
import subdomain from 'express-subdomain';
import { LOG_INFO } from '@/logger';

import DISCOVERY from '@/services/miiverse-api/routes/discovery';
import POST from '@/services/miiverse-api/routes/post';
import MESSAGE from '@/services/miiverse-api/routes/message';
import COMMUNITY from '@/services/miiverse-api/routes/communities';
import PEOPLE from '@/services/miiverse-api/routes/people';
import TOPICS from '@/services/miiverse-api/routes/topics';
import USERS from '@/services/miiverse-api/routes/users';
import PING from '@/services/miiverse-api/routes/ping';

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const discovery = express.Router();
const api = express.Router();

// Create subdomains
LOG_INFO('[MIIVERSE] Creating \'discovery\' subdomain');
router.use(subdomain('discovery.olv', discovery));
LOG_INFO('[MIIVERSE] Creating \'api\' subdomain');
router.use(subdomain('api.olv', api));
router.use(subdomain('api-test.olv', api));
router.use(subdomain('api-dev.olv', api));

// Setup routes
discovery.use('/v1/endpoint', DISCOVERY);
api.use('/v1/posts', POST);
api.use('/v1/posts.search', POST);
api.use('/v1/friend_messages', MESSAGE);
api.use('/v1/communities/', COMMUNITY);
api.use('/v1/people/', PEOPLE);
api.use('/v1/topics/', TOPICS);
api.use('/v1/users/', USERS);
api.use('/v1/status/', PING);

export default router;