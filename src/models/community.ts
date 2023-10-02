import { Schema, model } from 'mongoose';
import { ICommunity, ICommunityMethods, CommunityModel, HydratedCommunityDocument } from '@/types/mongoose/community';

const CommunitySchema = new Schema<ICommunity, CommunityModel, ICommunityMethods>({
	platform_id: Number,
	name: String,
	description: String,
	open: {
		type: Boolean,
		default: true
	},
	allows_comments: {
		type: Boolean,
		default: true
	},
	/**
     * 0: Main Community
     * 1: Sub-Community
     * 2: Announcement Community
     * 3: Private Community
     */
	type: {
		type: Number,
		default: 0
	},
	parent: {
		type: String,
		default: null
	},
	admins: {
		type: [Number],
		default: undefined
	},
	owner: Number,
	created_at: {
		type: Date,
		default: new Date(),
	},
	empathy_count: {
		type: Number,
		default: 0
	},
	followers: {
		type: Number,
		default: 0
	},
	has_shop_page: {
		type: Number,
		default: 0
	},
	icon: String,
	title_ids: {
		type: [String],
		default: undefined
	},
	title_id: {
		type: [String],
		default: undefined
	},
	community_id: String,
	olive_community_id: String,
	is_recommended: {
		type: Number,
		default: 0
	},
	app_data: String,
	user_favorites: {
		type: [Number],
		default: []
	}
});

CommunitySchema.method<HydratedCommunityDocument>('addUserFavorite', async function addUserFavorite(pid: number): Promise<void> {
	if (!this.user_favorites.includes(pid)) {
		this.user_favorites.push(pid);
	}

	await this.save();
});

CommunitySchema.method<HydratedCommunityDocument>('delUserFavorite', async function delUserFavorite(pid: number): Promise<void> {
	if (this.user_favorites.includes(pid)) {
		this.user_favorites.splice(this.user_favorites.indexOf(pid), 1);
	}

	await this.save();
});

CommunitySchema.method<HydratedCommunityDocument>('json', function json(): Record<string, any> {
	return {
		community_id: this.community_id,
		name: this.name,
		description: this.description,
		icon: this.icon.replace(/[^A-Za-z0-9+/=\s]/g, ''),
		icon_3ds: '',
		pid: this.owner || '',
		app_data: this.app_data.replace(/[^A-Za-z0-9+/=\s]/g, ''),
		is_user_community: '0'
	};
});

export const Community = model<ICommunity, CommunityModel>('Community', CommunitySchema);