import { Model, Types, HydratedDocument } from 'mongoose';

enum COMMUNITY_TYPE {
	Main = 0,
	Sub = 1,
	Announcement = 2,
	Private = 3
}

export interface ICommunity {
	platform_id: number;
	name: string;
	description: string;
	open: boolean;
	allows_comments: boolean;
	type: COMMUNITY_TYPE;
	parent: string;
	admins: Types.Array<number>;
	owner: number;
	created_at: Date;
	empathy_count: number;
	followers: number;
	has_shop_page: number;
	icon: string;
	title_ids: Types.Array<string>;
	title_id: Types.Array<string>;
	community_id: string;
	olive_community_id: string;
	is_recommended: number;
	app_data: string;
	user_favorites: Types.Array<number>;
}

export interface ICommunityMethods {
	addUserFavorite(pid: number): Promise<void>;
	delUserFavorite(pid: number): Promise<void>;
	json(): Record<string, any>;
}

interface ICommunityQueryHelpers {}

export interface CommunityModel extends Model<ICommunity, ICommunityQueryHelpers, ICommunityMethods> {}

export type HydratedCommunityDocument = HydratedDocument<ICommunity, ICommunityMethods>