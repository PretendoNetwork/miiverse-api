// TODO - Make this more generic

export interface SubCommunityQuery {
	parent: string;
	owner?: number;
	user_favorites?: number;
	olive_community_id?: string;
	community_id?: string;
}