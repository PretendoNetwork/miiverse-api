import { Schema, model } from 'mongoose';
import { HydratedSettingsDocument, ISettings, ISettingsMethods, SettingsModel } from '@/types/mongoose/settings';

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

SettingsSchema.method<HydratedSettingsDocument>('updateComment', async function updateComment(comment) {
	this.profile_comment = comment;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('updateSkill', async function updateSkill(skill) {
	this.game_skill = skill;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('commentVisible', async function commentVisible(active) {
	this.profile_comment_visibility = active;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('skillVisible', async function skillVisible(active) {
	this.game_skill_visibility = active;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('birthdayVisible', async function birthdayVisible(active) {
	this.birthday_visibility = active;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('relationshipVisible', async function relationshipVisible(active) {
	this.relationship_visibility = active;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('countryVisible', async function countryVisible(active) {
	this.country_visibility = active;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('favCommunityVisible', async function favCommunityVisible(active) {
	this.profile_favorite_community_visibility = active;
	await this.save();
});

SettingsSchema.method<HydratedSettingsDocument>('json', function json(): Record<string, any> {
	return {
		pid: this.pid,
		screen_name: this.screen_name
	};
});

export const Settings = model<ISettings, SettingsModel>('Settings', SettingsSchema);
