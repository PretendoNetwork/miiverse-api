import express from 'express';
import multer from 'multer';
import xmlbuilder from 'xmlbuilder';
import { z } from 'zod';
import { GetUserDataResponse } from '@pretendonetwork/grpc/account/get_user_data_rpc';
import {
	getUserAccountData,
	processPainting,
	uploadCDNAsset,
	getValueFromQueryString,
	INVALID_POST_BODY_REGEX
} from '@/util';
import {
	getPostByID,
	getUserContent,
	getPostReplies,
	getUserSettings,
	getCommunityByID,
	getCommunityByTitleID,
	getDuplicatePosts
} from '@/database';
import { LOG_WARN } from '@/logger';
import { Post } from '@/models/post';
import { Community } from '@/models/community';
import { HydratedPostDocument } from '@/types/mongoose/post';
import { PostRepliesResult } from '@/types/miiverse/post';

const newPostSchema = z.object({
	community_id: z.string().optional(),
	app_data: z.string().optional(),
	painting: z.string().optional(),
	screenshot: z.string().optional(),
	body: z.string().optional(),
	feeling_id: z.string(),
	search_key: z.string().array().or(z.string()).optional(),
	topic_tag: z.string().optional(),
	is_autopost: z.string(),
	is_spoiler: z.string().optional(),
	is_app_jumpable: z.string().optional(),
	language_id: z.string()
});

const router = express.Router();
const upload = multer();

/* GET post titles. */
router.post('/', upload.none(), newPost);

router.post('/:post_id/replies', upload.none(), newPost);

router.post('/:post_id.delete', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const post = await getPostByID(request.params.post_id);
	const userContent = await getUserContent(request.pid);

	if (!post || !userContent) {
		response.sendStatus(504);
		return;
	}

	if (post.pid === userContent.pid) {
		await post.del('User requested removal');
		response.sendStatus(200);
	} else {
		response.sendStatus(401);
	}
});

router.post('/:post_id/empathies', upload.none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const post = await getPostByID(request.params.post_id);

	if (!post) {
		response.sendStatus(404);
		return;
	}

	if (post.yeahs?.indexOf(request.pid) === -1) {
		await Post.updateOne({
			id: post.id,
			yeahs: {
				$ne: request.pid
			}
		},
		{
			$inc: {
				empathy_count: 1
			},
			$push: {
				yeahs: request.pid
			}
		});
	} else if (post.yeahs?.indexOf(request.pid) !== -1) {
		await Post.updateOne({
			id: post.id,
			yeahs: {
				$eq: request.pid
			}
		},
		{
			$inc: {
				empathy_count: -1
			},
			$pull: {
				yeahs: request.pid
			}
		});
	}

	response.sendStatus(200);
});

router.get('/:post_id/replies', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const limitString = getValueFromQueryString(request.query, 'limit')[0];

	let limit = 10; // TODO - Is there a real limit?

	if (limitString) {
		limit = parseInt(limitString);
	}

	if (isNaN(limit)) {
		limit = 10;
	}

	const post = await getPostByID(request.params.post_id);

	if (!post) {
		response.sendStatus(404);
		return;
	}

	const posts = await getPostReplies(post.id, limit);
	if (posts.length === 0) {
		response.sendStatus(404);
		return;
	}

	const result: PostRepliesResult = {
		has_error: 0,
		version: 1,
		request_name: 'replies',
		posts: []
	};

	for (const post of posts) {
		result.posts.push({
			post: post.json({
				with_mii: request.query.with_mii as string === '1',
				topic_tag: true
			})
		});
	}

	response.send(xmlbuilder.create({
		result
	}, {
		separateArrayItems: true
	}).end({
		pretty: true,
		allowEmpty: true
	}));
});

router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const postID = getValueFromQueryString(request.query, 'post_id')[0];

	if (!postID) {
		response.type('application/xml');
		response.status(404);
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 404,
				message: 'Not Found'
			}
		}).end({ pretty: true }));
		return;
	}

	const post = await getPostByID(postID);

	if (!post) {
		response.status(404);
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 404,
				message: 'Not Found'
			}
		}).end({ pretty: true }));
		return;
	}

	response.send(xmlbuilder.create({
		result: {
			has_error: '0',
			version: '1',
			request_name: 'posts.search',
			posts: {
				post: post.json({ with_mii: true })
			}
		}
	}).end({ pretty: true, allowEmpty: true }));
});

async function newPost(request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	let user: GetUserDataResponse;

	try {
		user  = await getUserAccountData(request.pid);
	} catch (error) {
		// TODO - Log this error
		response.sendStatus(403);
		return;
	}

	if (!user.mii) {
		// * This should never happen, but TypeScript complains so check anyway
		// TODO - Better errors
		response.status(422);
		return;
	}

	const userSettings = await getUserSettings(request.pid);
	const bodyCheck = newPostSchema.safeParse(request.body);

	if (!userSettings || !bodyCheck.success) {
		response.sendStatus(403);
		return;
	}

	const communityID = bodyCheck.data.community_id || '';
	const messageBody = bodyCheck.data.body?.trim();
	const painting = bodyCheck.data.painting?.replace(/\0/g, '').trim() || '';
	const screenshot = bodyCheck.data.screenshot?.replace(/\0/g, '').trim() || '';
	const appData = bodyCheck.data.app_data?.replace(/[^A-Za-z0-9+/=\s]/g, '').trim() || '';
	const feelingID = parseInt(bodyCheck.data.feeling_id);
	let searchKey = bodyCheck.data.search_key || [];
	const topicTag = bodyCheck.data.topic_tag || '';
	const autopost = bodyCheck.data.is_autopost;
	const spoiler = bodyCheck.data.is_spoiler;
	const jumpable = bodyCheck.data.is_app_jumpable;
	const languageID = parseInt(bodyCheck.data.language_id);
	const countryID = parseInt(request.paramPack.country_id);
	const platformID = parseInt(request.paramPack.platform_id);
	const regionID = parseInt(request.paramPack.region_id);

	if (
		isNaN(feelingID) ||
		isNaN(languageID) ||
		isNaN(countryID) ||
		isNaN(platformID) ||
		isNaN(regionID)
	) {
		response.sendStatus(403);
		return;
	}

	let community = await getCommunityByID(communityID);
	if (!community) {
		community = await Community.findOne({
			olive_community_id: communityID
		});
	}

	if (!community) {
		community = await getCommunityByTitleID(request.paramPack.title_id);
	}

	if (!community || userSettings.account_status !== 0 || community.community_id === 'announcements') {
		response.sendStatus(403);
		return;
	}

	let parentPost: HydratedPostDocument | null = null;
	if (request.params.post_id) {
		parentPost = await getPostByID(request.params.post_id.toString());

		if (!parentPost) {
			response.sendStatus(403);
			return;
		}
	}

	// TODO - Clean this up
	// * Nesting this because of how many checks there are, extremely unreadable otherwise
	if (!(community.admins && community.admins.indexOf(request.pid) !== -1 && userSettings.account_status === 0)) {
		if (community.type >= 2 || user.accessLevel < community.permissions.minimum_new_post_access_level) {
			if (!(parentPost && user.accessLevel >= community.permissions.minimum_new_comment_access_level && community.permissions.open)) {
				response.sendStatus(403);
				return;
			}
		}
	}

	let miiFace = 'normal_face.png';
	switch (parseInt(request.body.feeling_id)) {
		case 1:
			miiFace = 'smile_open_mouth.png';
			break;
		case 2:
			miiFace = 'wink_left.png';
			break;
		case 3:
			miiFace = 'surprise_open_mouth.png';
			break;
		case 4:
			miiFace = 'frustrated.png';
			break;
		case 5:
			miiFace = 'sorrow.png';
			break;
	}

	if (messageBody && INVALID_POST_BODY_REGEX.test(messageBody)) {
		// TODO - Log this error
		response.sendStatus(400);
		return;
	}

	if (messageBody && messageBody.length > 280) {
		// TODO - Log this error
		response.sendStatus(400);
		return;
	}

	if (!messageBody?.trim() && !painting?.trim() && !screenshot?.trim()) {
		response.status(400);
		return;
	}

	if (!Array.isArray(searchKey)) {
		searchKey = [searchKey];
	}

	const document = {
		id: '', // * This gets changed when saving the document for the first time
		title_id: request.paramPack.title_id,
		community_id: community.olive_community_id,
		screen_name: userSettings.screen_name,
		body: messageBody ? messageBody : '',
		app_data: appData,
		painting: painting,
		screenshot: '',
		screenshot_length: 0,
		country_id: countryID,
		created_at: new Date(),
		feeling_id: feelingID,
		search_key: searchKey,
		topic_tag: topicTag,
		is_autopost: (autopost) ? 1 : 0,
		is_spoiler: (spoiler === '1') ? 1 : 0,
		is_app_jumpable: (jumpable) ? 1 : 0,
		language_id: languageID,
		mii: user.mii.data,
		mii_face_url: `https://mii.olv.pretendo.cc/mii/${user.pid}/${miiFace}`,
		pid: request.pid,
		platform_id: platformID,
		region_id: regionID,
		verified: (user.accessLevel === 2 || user.accessLevel === 3),
		parent: parentPost ? parentPost.id : null,
		removed: false
	};

	const duplicatePost = await getDuplicatePosts(request.pid, document);

	if (duplicatePost) {
		response.status(400);
		response.send(xmlbuilder.create({
			result: {
				has_error: 1,
				version: 1,
				code: 400,
				error_code: 7,
				message: 'DUPLICATE_POST'
			}
		}).end({ pretty: true }));
		return;
	}

	const post = await Post.create(document);

	if (painting) {
		const paintingBuffer = await processPainting(painting);

		if (paintingBuffer) {
			await uploadCDNAsset('pn-cdn', `paintings/${request.pid}/${post.id}.png`, paintingBuffer, 'public-read');
		} else {
			LOG_WARN(`PAINTING FOR POST ${post.id} FAILED TO PROCESS`);
		}
	}

	if (screenshot) {
		const screenshotBuffer = Buffer.from(screenshot, 'base64');

		await uploadCDNAsset('pn-cdn', `screenshots/${request.pid}/${post.id}.jpg`, screenshotBuffer, 'public-read');

		post.screenshot = `/screenshots/${request.pid}/${post.id}.jpg`;
		post.screenshot_length = screenshot.length;

		await post.save();
	}

	if (parentPost) {
		parentPost.reply_count = (parentPost.reply_count || 0) + 1;
		parentPost.save();
	}

	response.send(xmlbuilder.create({
		result: {
			has_error: '0',
			version: '1',
			post: {
				post: post.json({ with_mii: true })
			}
		}
	}).end({ pretty: true, allowEmpty: true }));
}

export default router;