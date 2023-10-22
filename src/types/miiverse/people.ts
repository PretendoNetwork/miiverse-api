import { PostData } from '@/types/miiverse/post';
import { SettingsData } from '@/types/miiverse/settings';

export type PersonPosts = {
	person: {
		posts: {
			post: PostData;
		}[];
	}
};

export type PeoplePostsResult = {
	has_error: 0 | 1;
	version: 1;
	expire: string;
	request_name: 'posts';
	people: PersonPosts[];
};

export type PeopleFollowingResult = {
	has_error: 0 | 1;
	version: 1;
	request_name: 'user_infos';
	people: {
		person: SettingsData;
	}[];
};