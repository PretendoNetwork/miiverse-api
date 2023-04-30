import { Model, Types, HydratedDocument } from 'mongoose';

export interface IContent {
	pid: number;
    followed_communities: Types.Array<string>;
    followed_users: Types.Array<number>;
    following_users: Types.Array<number>;
}

export interface IContentMethods {
	addToCommunities(): Promise<void>
	removeFromCommunities(): Promise<void>
	addToUsers(): Promise<void>
	removeFromUsers(): Promise<void>
	addToFollowers(): Promise<void>
	removeFromFollowers(): Promise<void>
}

interface IContentQueryHelpers {}

export interface ContentModel extends Model<IContent, IContentQueryHelpers, IContentMethods> {}

export type HydratedContentDocument = HydratedDocument<IContent, IContentMethods>