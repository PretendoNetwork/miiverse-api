import express from 'express';
import xmlbuilder from 'xmlbuilder';
import moment from 'moment';
import { getUserContent, getFollowedUsers } from '@/database';
import { getValueFromQueryString, getUserFriendPIDs } from '@/util';
import { Post } from '@/models/post';
import { HydratedContentDocument } from '@/types/mongoose/content';
import { CommunityPostsQuery } from '@/types/mongoose/community-posts-query';
import { HydratedPostDocument, IPost } from '@/types/mongoose/post';
import { HydratedSettingsDocument } from '@/types/mongoose/settings';

const router: express.Router = express.Router();

/* GET post titles. */
router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const userContent: HydratedContentDocument | null = await getUserContent(request.pid);

	if (!userContent) {
		response.sendStatus(404);
		return;
	}

	const query: CommunityPostsQuery = {
		removed: false,
		is_spoiler: 0,
		app_data: { $eq: null },
		parent: { $eq: null },
		message_to_pid: { $eq: null }
	};

	const relation: string | undefined = getValueFromQueryString(request.query, 'relation');
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

	if (relation === 'friend') {
		query.pid = { $in: await getUserFriendPIDs(request.pid) };
	} else if (relation === 'following') {
		query.pid = { $in: userContent.followed_users };
	} else if (request.query.pid) {
		// TODO - Update getValueFromQueryString to return arrays optionally
		query.pid = { $in: (request.query.pid as string[]).map(pid => Number(pid)) };
	}

	let posts: HydratedPostDocument[];
	if (distinctPID === '1') {
		posts = await Post.aggregate([
			{ $match: query }, // filter based on input query
			{ $sort: { created_at: -1 } }, // sort by 'created_at' in descending order
			{ $group: { _id: '$pid', doc: { $first: '$$ROOT' } } }, // remove any duplicate 'pid' elements
			{ $replaceRoot: { newRoot: '$doc' } }, // replace the root with the 'doc' field
			{ $limit: limit } // only return the top 10 results
		]);

		posts = posts.map((post: IPost) => Post.hydrate(post));
	} else if (request.query.is_hot === '1') {
		posts = await Post.find(query).sort({ empathy_count: -1}).limit(limit);
	} else {
		posts = await Post.find(query).sort({ created_at: -1}).limit(limit);
	}

	const json: Record<string, any> = {
		result: {
			has_error: 0,
			version: 1,
			expire: moment().add(1, 'days').format('YYYY-MM-DD HH:MM:SS'),
			request_name: 'posts',
			people: []
		}
	};

	for (const post of posts) {
		json.result.people.push({
			person: {
				posts: [
					{
						post: post.json({
							with_mii: withMii === '1',
							topic_tag: true
						})
					}
				]
			}
		});
	}

	response.send(xmlbuilder.create(json, { separateArrayItems: true }).end({ pretty: true, allowEmpty: true }));
});

router.get('/:pid/following', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const pid: number = parseInt(request.params.pid);

	if (isNaN(pid)) {
		response.sendStatus(404);
		return;
	}

	const userContent: HydratedContentDocument | null = await getUserContent(pid);

	if (!userContent) {
		response.sendStatus(404);
		return;
	}

	const people: HydratedSettingsDocument[] = await getFollowedUsers(userContent);

	const json: Record<string, any> = {
		result: {
			has_error: '0',
			version: '1',
			request_name: 'user_infos',
			people: []
		}
	};

	for (const person of people) {
		json.result.people.push({
			person: person.json()
		});
	}

	response.send(xmlbuilder.create(json, { separateArrayItems: true }).end({ pretty: true, allowEmpty: true }));
});

export default router;