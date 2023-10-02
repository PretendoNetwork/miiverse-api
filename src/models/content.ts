import { Schema, model } from 'mongoose';
import { IContent, IContentMethods, ContentModel, HydratedContentDocument } from '@/types/mongoose/content';

const ContentSchema = new Schema<IContent, ContentModel, IContentMethods>({
	pid: Number,
	followed_communities: {
		type: [String],
		default: [0]
	},
	followed_users: {
		type: [Number],
		default: [0]
	},
	following_users: {
		type: [Number],
		default: [0]
	}
});

ContentSchema.method<HydratedContentDocument>('addToCommunities', async function addToCommunities(postID) {
	this.followed_communities.addToSet(postID);
	await this.save();
});

ContentSchema.method<HydratedContentDocument>('removeFromCommunities', async function removeFromCommunities(postID) {
	this.followed_communities.pull(postID);
	await this.save();
});

ContentSchema.method<HydratedContentDocument>('addToUsers', async function addToUsers(postID) {
	this.followed_users.addToSet(postID);
	await this.save();
});

ContentSchema.method<HydratedContentDocument>('removeFromUsers', async function removeFromUsers(postID) {
	this.followed_users.pull(postID);
	await this.save();
});

ContentSchema.method<HydratedContentDocument>('addToFollowers', async function addToFollowers(postID) {
	this.following_users.addToSet(postID);
	await this.save();
});

ContentSchema.method<HydratedContentDocument>('removeFromFollowers', async function removeFromFollowers(postID) {
	this.following_users.pull(postID);
	await this.save();
});

export const Content = model<IContent, ContentModel>('Content', ContentSchema);
