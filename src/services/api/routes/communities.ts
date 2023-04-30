import express from 'express';
import xmlbuilder from 'xmlbuilder';
import multer from 'multer';
import { z } from 'zod';
import {
	getSubCommunities,
	getMostPopularCommunities,
	getNewCommunities,
	getCommunityByTitleID,
	getUserContent,
	getCommunityByTitleIDs
} from '@/database';
import { getValueFromQueryString } from '@/util';
import { LOG_WARN } from '@/logger';
import { Community } from '@/models/community';
import { Post } from '@/models/post';
import { CreateNewCommunityBody } from '@/types/common/create-new-community-body';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { CommunityPostsQuery } from '@/types/mongoose/community-posts-query';
import { HydratedContentDocument } from '@/types/mongoose/content';
import { HydratedPostDocument } from '@/types/mongoose/post';

const createNewCommunitySchema = z.object({
	name: z.string(),
	description: z.string(),
	icon: z.string(),
	app_data: z.string()
});

const router: express.Router = express.Router();

/* GET post titles. */
router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const parentCommunity: HydratedCommunityDocument | null = await getCommunityByTitleID(request.paramPack.title_id);
	if (!parentCommunity) {
		response.status(404);
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 404,
				error_code: 919,
				message: 'COMMUNITY_NOT_FOUND'
			}
		}).end({ pretty: true }));
		return;
	}

	const communities: HydratedCommunityDocument[] = await getSubCommunities(parentCommunity.olive_community_id);
	communities.unshift(parentCommunity);

	const json: Record<string, any> = {
		result: {
			has_error: '0',
			version: '1',
			request_name: 'communities',
			communities: []
		}
	};

	for (const community of communities) {
		json.result.communities.push({
			community: community.json()
		});
	}

	response.send(xmlbuilder.create(json, { separateArrayItems: true }).end({ pretty: true, allowEmpty: true }));
});

router.get('/popular', async function (_request: express.Request, response: express.Response): Promise<void> {
	const popularCommunities: HydratedCommunityDocument[] = await getMostPopularCommunities(100);

	response.type('application/json');
	response.send(popularCommunities);
});

router.get('/new', async function (_request: express.Request, response: express.Response): Promise<void> {
	const newCommunities: HydratedCommunityDocument[] = await getNewCommunities(100);

	response.type('application/json');
	response.send(newCommunities);
});

router.get('/:communityID/posts', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	let community: HydratedCommunityDocument | null = await Community.findOne({
		community_id: request.params.communityID
	});

	if (!community) {
		community = await getCommunityByTitleID(request.paramPack.title_id);
	}

	if (!community) {
		response.status(404);
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 404,
				error_code: 919,
				message: 'COMMUNITY_NOT_FOUND'
			}
		}).end({ pretty: true }));
		return;
	}

	const query: CommunityPostsQuery = {
		community_id: community.olive_community_id,
		removed: false,
		app_data: { $ne: null },
		message_to_pid: { $eq: null }
	};

	const searchKey: string | undefined = getValueFromQueryString(request.query, 'search_key');
	const allowSpoiler: string | undefined = getValueFromQueryString(request.query, 'allow_spoiler');
	const postType: string | undefined = getValueFromQueryString(request.query, 'type');
	const queryBy: string | undefined = getValueFromQueryString(request.query, 'by');
	const distinctPID: string | undefined = getValueFromQueryString(request.query, 'distinct_pid');
	const limitString: string | undefined = getValueFromQueryString(request.query, 'limit');
	const withMii: string | undefined = getValueFromQueryString(request.query, 'with_mii');

	let limit: number = 10;

	if (limitString) {
		limit = parseInt(limitString);
	}

	if (isNaN(limit)) {
		limit = 10;
	}

	if (searchKey) {
		query.search_key = searchKey;
	}

	if (!allowSpoiler) {
		query.is_spoiler = 0;
	}

	//TODO: There probably is a type for text and screenshots too, will have to investigate
	if (postType === 'memo') {
		query.painting = { $ne: null };
	}

	if (queryBy === 'followings') {
		const userContent: HydratedContentDocument | null = await getUserContent(request.pid);

		if (!userContent) {
			LOG_WARN(`USER PID ${request.pid} HAS NO USER CONTENT`);
			query.pid = [];
		} else {
			query.pid = userContent.following_users;
		}
	} else if (queryBy === 'self') {
		query.pid = request.pid;
	}

	let posts: HydratedPostDocument[];
	if (distinctPID && distinctPID === '1') {
		posts = await Post.aggregate([
			{ $match: query }, // filter based on input query
			{ $sort: { created_at: -1 } }, // sort by 'created_at' in descending order
			{ $group: { _id: '$pid', doc: { $first: '$$ROOT' } } }, // remove any duplicate 'pid' elements
			{ $replaceRoot: { newRoot: '$doc' } }, // replace the root with the 'doc' field
			{ $limit: limit } // only return the top 10 results
		]);
	} else {
		posts = await Post.find(query).sort({ created_at: -1}).limit(limit);
	}

	const json: Record<string, any> = {
		result: {
			has_error: 0,
			version: 1,
			request_name: 'posts',
			topic: {
				community_id: community.community_id
			},
			posts: []
		}
	};

	for (const post of posts) {
		json.result.posts.push({
			post: post.json({
				with_mii: withMii === '1',
				app_data: true,
				topic_tag: true
			})
		});
	}

	response.send(xmlbuilder.create(json, { separateArrayItems: true }).end({ pretty: true, allowEmpty: true }));
});

// Handler for POST on '/v1/communities'
router.post('/', multer().none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const parentCommunity: HydratedCommunityDocument | null = await getCommunityByTitleIDs([request.paramPack.title_id]);

	if (!parentCommunity) {
		response.status(404);
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 404,
				error_code: 919,
				message: 'COMMUNITY_NOT_FOUND'
			}
		}).end({ pretty: true }));
		return;
	}

	// TODO - Better error codes, maybe do defaults?
	const bodyCheck: z.SafeParseReturnType<CreateNewCommunityBody, CreateNewCommunityBody> = createNewCommunitySchema.safeParse(request.body);
	if (!bodyCheck.success) {
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 404,
				error_code: 20,
				message: 'BAD_COMMUNITY_DATA'
			}
		}).end({ pretty: true }));
		return;
	}

	const communitiesCount: number = await Community.count();
	const community: HydratedCommunityDocument = await Community.create({
		platform_id: 0, // WiiU
		name: request.body.name,
		description: request.body.description,
		open: true,
		allows_comments: true,
		type: 1,
		parent: parentCommunity.community_id,
		admins: parentCommunity.admins,
		icon: request.body.icon,
		title_id: request.paramPack.title_id,
		community_id: (parseInt(parentCommunity.community_id) + (5000 * communitiesCount)).toString(),
		olive_community_id: (parseInt(parentCommunity.community_id) + (5000 * communitiesCount)).toString(),
		app_data: request.body.app_data.replace(/[^A-Za-z0-9+/=\s]/g, ''),
	});

	response.send(xmlbuilder.create({
		result: {
			has_error: '0',
			version: '1',
			request_name: 'community',
			community: community.json()
		}
	}).end({ pretty: true, allowEmpty: true }));
});

export default router;
