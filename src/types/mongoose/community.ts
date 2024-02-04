import { Model, Types, HydratedDocument } from 'mongoose';
import { CommunityData } from '@/types/miiverse/community';

enum COMMUNITY_TYPE {
	Main = 0,
	Sub = 1,
	Announcement = 2,
	Private = 3
}

export interface ICommunityPermissions {
	open: boolean;
	minimum_new_post_access_level: number;
	minimum_new_comment_access_level: number;
	minimum_new_community_access_level: number;
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
	permissions: ICommunityPermissions
}

export interface ICommunityMethods {
	addUserFavorite(pid: number): Promise<void>;
	delUserFavorite(pid: number): Promise<void>;
	json(): CommunityData;
}

export type CommunityModel = Model<ICommunity, object, ICommunityMethods>;

export type HydratedCommunityDocument = HydratedDocument<ICommunity, ICommunityMethods>;