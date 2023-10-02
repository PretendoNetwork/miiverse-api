import express from 'express';
import moment from 'moment';
import xmlbuilder from 'xmlbuilder';
import { GetUserDataResponse } from 'pretendo-grpc-ts/dist/account/get_user_data_rpc';
import { getUserAccountData } from '@/util';
import Cache from '@/cache';
import { getEndpoint } from '@/database';
import { Post } from '@/models/post';
import { Community } from '@/models/community';
import { HydratedEndpointDocument } from '@/types/mongoose/endpoint';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { WWPData, WWPPost, WWPTopic } from '@/types/common/wara-wara-plaza';

const router = express.Router();
const ONE_HOUR = 60 * 60 * 1000;
const WARA_WARA_PLAZA_CACHE = new Cache<WWPData>(ONE_HOUR);

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

	if (!WARA_WARA_PLAZA_CACHE.valid()) {
		const communities: HydratedCommunityDocument[] = await calculateMostPopularCommunities(24, 10);

		if (communities.length < 10) {
			response.sendStatus(404);
			return;
		}

		WARA_WARA_PLAZA_CACHE.update(await generateTopicsData(communities));
	}

	const data = WARA_WARA_PLAZA_CACHE.get() || {};

	response.send(xmlbuilder.create(data, { separateArrayItems: true }).end({ pretty: true, allowEmpty: true }));
});

async function generateTopicsData(communities: HydratedCommunityDocument[]): Promise<WWPData> {
	const topics: {
		topic: WWPTopic;
	}[] = [];

	for (let i = 0; i < communities.length; i++) {
		const community = communities[i];

		const empathies = await Post.aggregate([
			{
				$match: {
					community_id: community.olive_community_id
				}
			},
			{
				$group : {
					_id : null,
					total : {
						$sum : '$empathy_count'
					}
				}
			},
			{
				$limit: 1
			}
		]);

		const topic: WWPTopic = {
			empathy_count: empathies[0]?.total || 0,
			has_shop_page: community.has_shop_page ? 1 : 0,
			icon: community.icon,
			title_ids: [],
			title_id: community.title_id[0],
			community_id: 0xFFFFFFFF, // * This is how it was in the real WWP. Unsure why, but it works
			is_recommended: community.is_recommended ? 1 : 0,
			name: community.name,
			people: [],
			position: i+1
		};

		community.title_id.forEach(title_id => {
			// * Just in case
			if (title_id) {
				topic.title_ids.push({ title_id });
			}
		});

		const people = await getCommunityPeople(community);

		for (const person of people) {
			const hydratedPost = Post.hydrate(person.post);

			const post: WWPPost = {
				body: hydratedPost.cleanedBody(),
				community_id: 0xFFFFFFFF, // * This is how it was in the real WWP. Unsure why, but it works
				country_id: hydratedPost.country_id,
				created_at: moment(hydratedPost.created_at).format('YYYY-MM-DD HH:MM:SS'),
				feeling_id: hydratedPost.feeling_id,
				id: hydratedPost.id,
				is_autopost: hydratedPost.is_autopost ? 1 : 0,
				is_community_private_autopost: hydratedPost.is_community_private_autopost ? 1 : 0,
				is_spoiler: hydratedPost.is_spoiler ? 1 : 0,
				is_app_jumpable: hydratedPost.is_app_jumpable ? 1 : 0,
				empathy_count: hydratedPost.empathy_count || 0,
				language_id: hydratedPost.language_id,
				mii: hydratedPost.cleanedMiiData(),
				mii_face_url: hydratedPost.mii_face_url,
				number: 0,
				painting: hydratedPost.formatPainting(),
				pid: hydratedPost.pid,
				platform_id: hydratedPost.platform_id,
				region_id: hydratedPost.region_id,
				reply_count: hydratedPost.reply_count || 0,
				screen_name: hydratedPost.screen_name,
				screenshot: hydratedPost.formatScreenshot(),
				title_id: hydratedPost.title_id,
			};

			topic.people.push({
				person: {
					posts: [
						{
							post
						}
					]
				}
			});
		}

		topics.push({
			topic: topic
		});
	}

	return {
		result: {
			has_error: 0,
			version: 1,
			expire: moment().add(2, 'days').format('YYYY-MM-DD HH:MM:SS'),
			request_name: 'topics',
			topics
		}
	};
}

async function getCommunityPeople(community: HydratedCommunityDocument, hours = 24): Promise<any> {
	const now = new Date();
	const last24Hours = new Date(now.getTime() - hours * 60 * 60 * 1000);
	const people = await Post.aggregate([
		{
			$match: {
				title_id: {
					$in: community.title_id
				},
				created_at: {
					$gte: last24Hours
				},
				message_to_pid: null,
				parent: null,
				removed: false
			}
		},
		{
			$group: {
				_id: '$pid',
				post: {
					$first: '$$ROOT'
				}
			}
		},
		{
			$limit: 70 // * Arbitrary
		}
	]);

	// TODO - Remove this check once out of beta and have more users
	// * We only do this because Juxtaposition is not super active
	// * due to it being in beta. If we don't expand the search
	// * time range then WWP still ends up fairly empty
	// *
	// * Ensure we have at *least* 20 people. Arbitrary.
	// * If the year is less than 2020, assume we've gone
	// * too far back. There are no more posts, just return
	// * what was found
	if (people.length < 20 && last24Hours.getFullYear() >= 2020) {
		// * Double the search range each time to get
		// * exponentially more posts. This speeds up
		// * the search at the cost of using older posts
		return getCommunityPeople(community, hours * 2);
	}

	return people;
}

async function calculateMostPopularCommunities(hours: number, limit: number): Promise<HydratedCommunityDocument[]> {
	const now = new Date();
	const last24Hours = new Date(now.getTime() - hours * 60 * 60 * 1000);

	if (!last24Hours) {
		throw new Error('Invalid date');
	}

	const validCommunities: {
		_id: null;
		communities: [string];
	}[] = await Community.aggregate([
		{
			$match: {
				type: 0,
				parent: null
			}
		},
		{
			$group: {
				_id: null,
				communities: {
					$push: '$olive_community_id'
				}
			}
		}
	]);

	const communityIDs: [string] = validCommunities[0].communities;

	if (!communityIDs) {
		throw new Error('No communities found');
	}

	const popularCommunities: {
		_id: string;
		count: number;
	}[] = await Post.aggregate([
		{
			$match: {
				created_at: {
					$gte: last24Hours
				},
				message_to_pid: null,
				community_id: {
					$in: communityIDs
				}
			}
		},
		{
			$group: {
				_id: '$community_id',
				count: {
					$sum: 1
				}
			}
		},
		{
			$limit: limit
		},
		{
			$sort: {
				count: -1
			}
		}
	]);

	if (popularCommunities.length < limit) {
		return calculateMostPopularCommunities(hours + hours, limit);
	}

	return Community.find({
		olive_community_id: {
			$in: popularCommunities.map(({ _id }) => _id)
		}
	});
}

export default router;
