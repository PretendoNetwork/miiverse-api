import express from 'express';
import subdomain from 'express-subdomain';
import { LOG_INFO } from '@/logger';
import postsHandlers from '@/services/api/routes/posts';
import friendMessagesHandlers from '@/services/api/routes/friend_messages';
import communitiesHandlers from '@/services/api/routes/communities';
import peopleHandlers from '@/services/api/routes/people';
import topicsHandlers from '@/services/api/routes/topics';
import usersHandlers from '@/services/api/routes/users';
import statusHandlers from '@/services/api/routes/status';

// Main router for endpointsindex.js
const router = express.Router();

// Router to handle the subdomain restriction
const api = express.Router();

// Create subdomains
LOG_INFO('[MIIVERSE] Creating \'api\' subdomain');
router.use(subdomain('api.olv', api));
router.use(subdomain('api-test.olv', api));
router.use(subdomain('api-dev.olv', api));

// Setup routes
api.use('/v1/posts', postsHandlers);
api.use('/v1/posts.search', postsHandlers);
api.use('/v1/friend_messages', friendMessagesHandlers);
api.use('/v1/communities/', communitiesHandlers);
api.use('/v1/people/', peopleHandlers);
api.use('/v1/topics/', topicsHandlers);
api.use('/v1/users/', usersHandlers);
api.use('/v1/status/', statusHandlers);

export default router;
