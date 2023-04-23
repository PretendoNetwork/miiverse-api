import { Schema, model } from 'mongoose';
import { ISettings, ISettingsMethods, SettingsModel } from '@/types/mongoose/settings';

const SettingsSchema = new Schema<ISettings, SettingsModel, ISettingsMethods>({
	pid: Number,
	screen_name: String,
	account_status: {
		type: Number,
		default: 0
	},
	ban_lift_date: Date,
	ban_reason: String,
	profile_comment: {
		type: String,
		default: undefined
	},
	profile_comment_visibility: {
		type: Boolean,
		default: true
	},
	game_skill: {
		type: Number,
		default: 0
	},
	game_skill_visibility: {
		type: Boolean,
		default: true
	},
	birthday_visibility: {
		type: Boolean,
		default: false
	},
	relationship_visibility: {
		type: Boolean,
		default: false
	},
	country_visibility: {
		type: Boolean,
		default: false
	},
	profile_favorite_community_visibility: {
		type: Boolean,
		default: true
	},
	receive_notifications: {
		type: Boolean,
		default: true
	}
});

SettingsSchema.method('updateComment', async function updateComment(comment) {
	this.set('profile_comment', comment);
	await this.save();
});

SettingsSchema.method('updateSkill', async function updateSkill(skill) {
	this.set('game_skill', skill);
	await this.save();
});

SettingsSchema.method('commentVisible', async function commentVisible(active) {
	this.set('profile_comment_visibility', active);
	await this.save();
});

SettingsSchema.method('skillVisible', async function skillVisible(active) {
	this.set('game_skill_visibility', active);
	await this.save();
});

SettingsSchema.method('birthdayVisible', async function birthdayVisible(active) {
	this.set('birthday_visibility', active);
	await this.save();
});

SettingsSchema.method('relationshipVisible', async function relationshipVisible(active) {
	this.set('relationship_visibility', active);
	await this.save();
});

SettingsSchema.method('countryVisible', async function countryVisible(active) {
	this.set('country_visibility', active);
	await this.save();
});

SettingsSchema.method('favCommunityVisible', async function favCommunityVisible(active) {
	this.set('profile_favorite_community_visibility', active);
	await this.save();
});

export const Settings: SettingsModel = model<ISettings, SettingsModel>('Settings', SettingsSchema);
