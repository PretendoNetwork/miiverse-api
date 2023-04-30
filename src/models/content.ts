import { Schema, model } from 'mongoose';
import { IContent, IContentMethods, ContentModel } from '@/types/mongoose/content';

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

ContentSchema.method('addToCommunities', async function addToCommunities(postID) {
	const communities = this.get('followed_communities');
	communities.addToSet(postID);
	await this.save();
});

ContentSchema.method('removeFromCommunities', async function removeFromCommunities(postID) {
	const communities = this.get('followed_communities');
	communities.pull(postID);
	await this.save();
});

ContentSchema.method('addToUsers', async function addToUsers(postID) {
	const users = this.get('followed_users');
	users.addToSet(postID);
	await this.save();
});

ContentSchema.method('removeFromUsers', async function removeFromUsers(postID) {
	const users = this.get('followed_users');
	users.pull(postID);
	await this.save();
});

ContentSchema.method('addToFollowers', async function addToFollowers(postID) {
	const users = this.get('following_users');
	users.addToSet(postID);
	await this.save();
});

ContentSchema.method('removeFromFollowers', async function removeFromFollowers(postID) {
	const users = this.get('following_users');
	users.pull(postID);
	await this.save();
});

export const Content: ContentModel = model<IContent, ContentModel>('Content', ContentSchema);
