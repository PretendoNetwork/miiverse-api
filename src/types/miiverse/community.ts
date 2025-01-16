import type { PostData } from '@/types/miiverse/post';

export type CommunityData = {
	community_id: string;
	name: string;
	description: string;
	icon: string;
	icon_3ds: string;
	pid: number;
	app_data: string;
	is_user_community: string;
};

export type CommunitiesResult = {
	has_error: 0 | 1;
	version: 1;
	request_name: 'communities';
	communities: {
		community: CommunityData;
	}[];
};

export type CommunityPostsResult = {
	has_error: 0 | 1;
	version: 1;
	request_name: 'posts';
	topic: {
		community_id: string;
	};
	posts: {
		post: PostData;
	}[];
};
