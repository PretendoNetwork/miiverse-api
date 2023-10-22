export type PostData = {
	app_data?: string; // TODO - I try to keep these fields in the real order they show up in, but idk where this one goes
	body?: string;
	community_id: number | string; // TODO - Remove this union. Only done to bypass some errors which don't break anything
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
	mii?: string;
	mii_face_url?: string;
	number: number;
	painting?: PostPainting;
	pid: number;
	platform_id: number;
	region_id: number;
	reply_count: number;
	screen_name: string;
	screenshot?: PostScreenshot;
	topic_tag?: PostTopicTag;
	title_id: string;
};

export type PostPainting = {
	format: string;
	content: string;
	size: number;
	url: string;
};

export type PostScreenshot = {
	size: number;
	url: string;
};

export type PostTopicTag = {
	name: string;
	title_id: string;
};

export type PostRepliesResult = {
	has_error: 0 | 1;
	version: 1;
	request_name: 'replies';
	posts: {
		post: PostData;
	}[];
};