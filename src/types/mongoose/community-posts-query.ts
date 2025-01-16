// TODO - Make this more generic

export interface CommunityPostsQuery {
	community_id?: string;
	removed: boolean;
	app_data?: {
		$ne?: null;
		$eq?: null;
	};
	message_to_pid?: {
		$eq: null;
	};
	search_key?: string;
	is_spoiler?: 0 | 1;
	painting?: {
		$ne: null;
	};
	pid?: number | number[] | {
		$in: number[];
	};
	parent?: {
		$eq: null;
	};
}
