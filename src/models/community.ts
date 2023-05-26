import { Schema, model } from 'mongoose';
import { ICommunity, ICommunityMethods, CommunityModel } from '@/types/mongoose/community';

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
});

CommunitySchema.method('upEmpathy', async function upEmpathy(): Promise<void> {
	const empathy = this.get('empathy_count');
	this.set('empathy_count', empathy + 1);

	await this.save();
});

CommunitySchema.method('downEmpathy', async function downEmpathy(): Promise<void> {
	const empathy = this.get('empathy_count');
	this.set('empathy_count', empathy - 1);

	await this.save();
});

CommunitySchema.method('upFollower', async function upFollower(): Promise<void> {
	const followers = this.get('followers');
	this.set('followers', followers + 1);

	await this.save();
});

CommunitySchema.method('downFollower', async function downFollower(): Promise<void> {
	const followers = this.get('followers');
	this.set('followers', followers - 1);

	await this.save();
});

CommunitySchema.method('json', function json(): Record<string, any> {
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

export const Community: CommunityModel = model<ICommunity, CommunityModel>('Community', CommunitySchema);