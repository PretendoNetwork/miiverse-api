import express from 'express';
import xmlbuilder from 'xmlbuilder';
import multer from 'multer';
import { z } from 'zod';
import {
	getMostPopularCommunities,
	getNewCommunities,
	getCommunityByTitleID,
	getUserContent,
} from '@/database';
import { getValueFromQueryString } from '@/util';
import { LOG_WARN } from '@/logger';
import { Community } from '@/models/community';
import { Post } from '@/models/post';
import { CreateNewCommunityBody } from '@/types/common/create-new-community-body';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { SubCommunityQuery } from '@/types/mongoose/subcommunity-query';
import { CommunityPostsQuery } from '@/types/mongoose/community-posts-query';
import { HydratedContentDocument } from '@/types/mongoose/content';
import { HydratedPostDocument, IPost } from '@/types/mongoose/post';
import { ParamPack } from '@/types/common/param-pack';

const createNewCommunitySchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	icon: z.string(),
	app_data: z.string().optional()
});

const router: express.Router = express.Router();

function respondCommunityError(response: express.Response, httpStatusCode: number, errorCode: number): void {
	response.status(httpStatusCode).send(xmlbuilder.create({
		result: {
			has_error: 1,
			version: 1,
			code: httpStatusCode,
			error_code: errorCode,
			message: 'COMMUNITY_ERROR' // This field is unused by the entire nn_olv.rpl
		}
	}).end({ pretty: true }));
}

function respondCommunityNotFound(response: express.Response): void {
	respondCommunityError(response, 404, 919);
}


async function commonGetSubCommunity(paramPack: ParamPack, communityID: string | undefined): Promise<HydratedCommunityDocument | null> {

	const parentCommunity: HydratedCommunityDocument | null = await getCommunityByTitleID(paramPack.title_id);
	if (!parentCommunity) {
		return null;
	}

	const query: SubCommunityQuery = {
		parent: parentCommunity.olive_community_id,
		community_id: communityID
	};

	const community: HydratedCommunityDocument | null = await Community.findOne(query);
	if (!community) {
		return null;
	}

	return community;
}

/* GET post titles. */
router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const parentCommunity: HydratedCommunityDocument | null = await getCommunityByTitleID(request.paramPack.title_id);
	if (!parentCommunity) {
		respondCommunityNotFound(response);
		return;
	}

	const type: string | undefined = getValueFromQueryString(request.query, 'type');
	const limitString: string | undefined = getValueFromQueryString(request.query, 'limit');

	let limit: number = 4;
	if (limitString) {
		limit = parseInt(limitString);
	}

	if (isNaN(limit)) {
		limit = 4;
	}

	if (limit > 16) {
		limit = 16;
	}

	const query: SubCommunityQuery = {
		parent: parentCommunity.olive_community_id
	};

	if (type === 'my') {
		query.owner = request.pid;
	} else if (type === 'favorite') {
		query.user_favorites = request.pid;
	}

	const communities: HydratedCommunityDocument[] = await Community.find(query).limit(limit);

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
		return respondCommunityNotFound(response);
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
		posts = posts.map((post: IPost) => Post.hydrate(post));
	} else {
		posts = await Post.find(query).sort({ created_at: -1 }).limit(limit);
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

	const parentCommunity: HydratedCommunityDocument | null = await getCommunityByTitleID(request.paramPack.title_id);
	if (!parentCommunity) {
		return respondCommunityNotFound(response);
	}

	// TODO - Better error codes, maybe do defaults?
	const bodyCheck: z.SafeParseReturnType<CreateNewCommunityBody, CreateNewCommunityBody> = createNewCommunitySchema.safeParse(request.body);
	if (!bodyCheck.success) {
		return respondCommunityError(response, 400, 20);
	}

	// Name must be at least 4 character long
	if (request.body.name.length < 4) {
		return respondCommunityError(response, 400, 20);
	}

	// Name must contain less than 5 numbers
	const digitCount = (request.body.name.match(/\d/g) || []).length;
	if (digitCount > 5) {
		return respondCommunityError(response, 400, 20);
	}

	// Each user can only have 4 subcommunities per title
	const ownedQuery: SubCommunityQuery = {
		parent: parentCommunity.olive_community_id,
		owner: request.pid
	};

	const ownedSubcommunityCount: number = await Community.countDocuments(ownedQuery);
	if (ownedSubcommunityCount >= 4) {
		return respondCommunityError(response, 401, 911);
	}

	// Each user can only have 16 favorite subcommunities per title
	const favoriteQuery: SubCommunityQuery = {
		parent: parentCommunity.olive_community_id,
		user_favorites: request.pid
	};

	const ownedFavoriteCount: number = await Community.countDocuments(favoriteQuery);
	if (ownedFavoriteCount >= 16) {
		return respondCommunityError(response, 401, 912);
	}

	const communitiesCount: number = await Community.count();
	const communityId: number = (parseInt(parentCommunity.community_id) + (5000 * communitiesCount)); // Change this to auto increment
	const community: HydratedCommunityDocument = await Community.create({
		platform_id: 0, // WiiU
		name: request.body.name,
		description: request.body.description || '',
		open: true,
		allows_comments: true,
		type: 1,
		parent: parentCommunity.olive_community_id,
		admins: parentCommunity.admins,
		owner: request.pid,
		icon: request.body.icon,
		title_id: request.paramPack.title_id,
		community_id: communityId.toString(),
		olive_community_id: communityId.toString(),
		app_data: request.body.app_data || '',
		user_favorites: [request.pid]
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

router.post('/:community_id.delete', multer().none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const community: HydratedCommunityDocument | null = await commonGetSubCommunity(request.paramPack, request.params.community_id);
	if (!community) {
		respondCommunityNotFound(response);
		return;
	}

	if (community.owner != request.pid) {
		response.sendStatus(403); // Forbidden
		return;
	}

	await Community.deleteOne({ _id: community._id });

	response.send(xmlbuilder.create({
		result: {
			has_error: '0',
			version: '1',
			request_name: 'community',
			community: community.json()
		}
	}).end({ pretty: true, allowEmpty: true }));
});

router.post('/:community_id.favorite', multer().none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const community: HydratedCommunityDocument | null = await commonGetSubCommunity(request.paramPack, request.params.community_id);
	if (!community) {
		respondCommunityNotFound(response);
		return;
	}

	// Each user can only have 16 favorite subcommunities per title
	const favoriteQuery: SubCommunityQuery = {
		parent: community.parent,
		user_favorites: request.pid
	};

	const ownedFavoriteCount: number = await Community.countDocuments(favoriteQuery);
	if (ownedFavoriteCount >= 16) {
		return respondCommunityError(response, 401, 914);
	}

	await community.addUserFavorite(request.pid);

	response.send(xmlbuilder.create({
		result: {
			has_error: '0',
			version: '1',
			request_name: 'community',
			community: community.json()
		}
	}).end({ pretty: true, allowEmpty: true }));
});

router.post('/:community_id.unfavorite', multer().none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const community: HydratedCommunityDocument | null = await commonGetSubCommunity(request.paramPack, request.params.community_id);
	if (!community) {
		respondCommunityNotFound(response);
		return;
	}

	// You can't remove from your favorites a community you own
	if (community.owner === request.pid) {
		return respondCommunityError(response, 401, 916);
	}

	await community.delUserFavorite(request.pid);

	response.send(xmlbuilder.create({
		result: {
			has_error: '0',
			version: '1',
			request_name: 'community',
			community: community.json()
		}
	}).end({ pretty: true, allowEmpty: true }));
});


router.post('/:community_id', multer().none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const community: HydratedCommunityDocument | null = await commonGetSubCommunity(request.paramPack, request.params.community_id);
	if (!community) {
		respondCommunityNotFound(response);
		return;
	}

	if (community.owner != request.pid) {
		response.sendStatus(403); // Forbidden
		return;
	}

	const bodyCheck: z.SafeParseReturnType<CreateNewCommunityBody, CreateNewCommunityBody> = createNewCommunitySchema.safeParse(request.body);
	if (!bodyCheck.success) {
		return respondCommunityError(response, 400, 20);
	}

	if (request.body.name) {
		community.name = request.body.name;
	}

	if (request.body.description) {
		community.description = request.body.description;
	}

	if (request.body.icon) {
		community.icon = request.body.icon;
	}

	if (request.body.app_data) {
		community.app_data = request.body.app_data;
	}

	await community.save();

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
