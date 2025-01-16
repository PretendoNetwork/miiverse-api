export interface FormattedMessage {
	post: {
		body: string;
		country_id: number;
		created_at: string;
		feeling_id: number;
		id: string;
		is_autopost: number;
		is_spoiler: number;
		is_app_jumpable: number;
		empathy_added?: number; // * Only optional because they are optional in Posts
		language_id: number;
		message_to_pid?: string; // * Only optional because they are optional in Posts
		mii: string;
		mii_face_url: string;
		number: number;
		pid: number;
		platform_id: number;
		region_id: number;
		reply_count?: number; // * Only optional because they are optional in Posts
		screen_name: string;
		topic_tag: {
			name: string;
			title_id: number;
		};
		title_id: string;
	};
}
