import type { Model, Types, HydratedDocument } from 'mongoose';

export interface IContent {
	pid: number;
	followed_communities: Types.Array<string>;
	followed_users: Types.Array<number>;
	following_users: Types.Array<number>;
}

export type ContentModel = Model<IContent>;

export type HydratedContentDocument = HydratedDocument<IContent>;
