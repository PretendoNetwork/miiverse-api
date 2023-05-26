// TODO - Make this more generic

export interface SubCommunityQuery {
	parent: string;
	owner?: number;
	olive_community_id?: {
		$in: string[]
	}
}