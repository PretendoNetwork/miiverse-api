import express from 'express';
import memoize from 'memoizee';
import moment from 'moment';
import xmlbuilder from 'xmlbuilder';
import { GetUserDataResponse } from 'pretendo-grpc-ts/dist/account/get_user_data_rpc';
import { getUserAccountData } from '@/util';
import { getEndpoint, getPostsBytitleID } from '@/database';
import { Post } from '@/models/post';
import { Community } from '@/models/community';
import { HydratedEndpointDocument } from '@/types/mongoose/endpoint';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { HydratedPostDocument } from '@/types/mongoose/post';

const router: express.Router = express.Router();

// TODO - Need to add types to memoize in @/types/memoize.d.ts
const memoizedGenerateTopicsXML = memoize(generateTopicsXML, {
	async: true,
	maxAge: 1000 * 60 * 60 // * cache for 1 hour
});

/* GET post titles. */
router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	let user: GetUserDataResponse;

	try {
		user  = await getUserAccountData(request.pid);
	} catch (error) {
		// TODO - Log this error
		response.sendStatus(403);
		return;
	}

	let discovery: HydratedEndpointDocument | null;

	if (user) {
		discovery = await getEndpoint(user.serverAccessLevel);
	} else {
		discovery = await getEndpoint('prod');
	}

	if (!discovery || !discovery.topics) {
		response.sendStatus(404);
		return;
	}

	const communities: HydratedCommunityDocument[] = await calculateMostPopularCommunities(24, 10);

	if (communities.length < 10) {
		response.sendStatus(404);
		return;
	}

	response.send(await memoizedGenerateTopicsXML(communities));
});

async function generateTopicsXML(communities: HydratedCommunityDocument[]): Promise<string> {
	const json: Record<string, any> = {
		result: {
			has_error: 0,
			version: 1,
			expire: moment().add(2, 'days').format('YYYY-MM-DD HH:MM:SS'),
			request_name: 'topics',
			topics: []
		}
	};

	for (const community of communities) {
		const topic: Record<string, any> = {
			topic: {
				empathy_count: community.empathy_count,
				has_shop_page: community.has_shop_page,
				icon: community.icon,
				title_ids: [],
				title_id: community.title_id[0],
				community_id: community.community_id,
				is_recommended: community.is_recommended,
				name: community.name,
				people: []
			}
		};

		community.title_id.forEach(function (title_id: string) {
			if (title_id !== '') {
				topic.topic.title_ids.push({ title_id });
			}
		});

		const posts: HydratedPostDocument[] = await getPostsBytitleID(community.title_id, 30);

		for (const post of posts) {
			topic.topic.people.push({
				person: {
					posts: [
						{
							post: post.json({
								with_mii: true,
								topics: true
							})
						}
					]
				}
			});
		}

		json.result.topics.push(topic);
	}

	return xmlbuilder.create(json, { separateArrayItems: true }).end({ pretty: true, allowEmpty: true });
}

async function calculateMostPopularCommunities(hours: number, limit: number): Promise<HydratedCommunityDocument[]> {
	const now: Date = new Date();
	const last24Hours: Date = new Date(now.getTime() - hours * 60 * 60 * 1000);
	const posts: HydratedPostDocument[] = await Post.find({ created_at: { $gte: last24Hours },  message_to_pid: null });

	if (!posts.length) {
		return [];
	}

	const communityIDCounts: {
		[key: string]: number
	} = {};

	for (const post of posts) {
		const communityID: string = post.community_id;
		communityIDCounts[communityID] = (communityIDCounts[communityID] || 0) + 1;
	}

	const popularCommunitiesSorted: string[] = Object.entries(communityIDCounts)
		.sort((a, b) => (b[1] as number) - (a[1] as number))
		.map((entry) => entry[0]);

	if (popularCommunitiesSorted.length < limit) {
		return Community.find().limit(limit).sort({
			followers: -1
		});
	}

	const response: HydratedCommunityDocument[] = await Community.aggregate([
		{ $match: { olive_community_id: { $in: popularCommunitiesSorted }, parent: null } },
		{$addFields: {
			index: { $indexOfArray: [ popularCommunitiesSorted, '$olive_community_id' ] }
		}},
		{ $sort: { index: 1 } },
		{ $limit : limit },
		{ $project: { index: 0, _id: 0 } }
	]);

	if (response.length < limit) {
		return calculateMostPopularCommunities(hours + hours, limit);
	} else {
		return response;
	}
}

export default router;
