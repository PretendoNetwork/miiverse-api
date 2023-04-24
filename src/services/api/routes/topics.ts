import express from 'express';
import memoize from 'memoizee';
import { getPNID, getEndpoint } from '@/database';
import { Post } from '@/models/post';
import { Community } from '@/models/community';
import comPostGen from '@/util/xmlResponseGenerator';
import { HydratedPNIDDocument } from '@/types/mongoose/pnid';
import { HydratedEndpointDocument } from '@/types/mongoose/endpoint';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { HydratedPostDocument } from '@/types/mongoose/post';

const router: express.Router = express.Router();

// TODO - Need to add types to memoize in @/types/memoize.d.ts
const memoized = memoize(comPostGen.topics, { async: true, maxAge: 1000 * 60 * 60 });

/* GET post titles. */
router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const user: HydratedPNIDDocument | null = await getPNID(request.pid);
	let discovery: HydratedEndpointDocument | null;

	if (user) {
		discovery = await getEndpoint(user.server_access_level);
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

	response.send(await memoized(communities));
});

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
