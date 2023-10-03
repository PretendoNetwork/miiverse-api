import { PersonPosts } from '@/types/miiverse/people';

export type WWPTopic = {
	empathy_count: number;
	has_shop_page: 0 | 1;
	icon: string;
	title_ids: {
		title_id: string;
	}[];
	title_id: string;
	community_id: number;
	is_recommended: 0 | 1;
	name: string;
	people: PersonPosts[];
	position: number;
};

export type WWPResult = {
	has_error: 0 | 1;
	version: 1;
	expire: string;
	request_name: 'topics';
	topics: {
		topic: WWPTopic;
	}[];
};

