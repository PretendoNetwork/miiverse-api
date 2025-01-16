import { Schema, model } from 'mongoose';
import type { IContent, ContentModel } from '@/types/mongoose/content';

const ContentSchema = new Schema<IContent, ContentModel>({
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

export const Content = model<IContent, ContentModel>('Content', ContentSchema);
