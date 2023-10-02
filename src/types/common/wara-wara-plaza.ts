// TODO - Maybe this can become more generalized, and not specific to WWP?
export type WWPPost = {
	body?: string;
	community_id: number;
	country_id: number;
	created_at: string;
	feeling_id: number;
	id: string;
	is_autopost: 0 | 1;
	is_community_private_autopost: 0 | 1;
	is_spoiler: 0 | 1;
	is_app_jumpable: 0 | 1;
	empathy_count: number;
	language_id: number;
	mii: string;
	mii_face_url: string;
	number: number;
	painting?: {
		format: string;
		content: string;
		size: number;
		url: string;
	};
	pid: number;
	platform_id: number;
	region_id: number;
	reply_count: number;
	screen_name: string;
	screenshot?: {
		size: number;
		url: string;
	};
	title_id: string;
};

export type WWPPerson = {
	person: {
		posts: {
			post: WWPPost;
		}[];
	}
};

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
	people: WWPPerson[];
	position: number;
};

export type WWPData = {
	result: {
		has_error: 0 | 1;
		version: 1;
		expire: string;
		request_name: 'topics';
		topics: {
			topic: WWPTopic;
		}[];
	}
};

