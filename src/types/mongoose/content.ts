import { Model, Types, HydratedDocument } from 'mongoose';

export interface IContent {
	pid: number;
    followed_communities: Types.Array<string>;
    followed_users: Types.Array<number>;
    following_users: Types.Array<number>;
}

export interface IContentMethods {}

interface IContentQueryHelpers {}

export interface ContentModel extends Model<IContent, IContentQueryHelpers, IContentMethods> {}

export type HydratedContentDocument = HydratedDocument<IContent, IContentMethods>