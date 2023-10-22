import { Schema, model } from 'mongoose';
import { SettingsData } from '@/types/miiverse/settings';
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

SettingsSchema.method<HydratedSettingsDocument>('json', function json(): SettingsData {
	return {
		pid: this.pid,
		screen_name: this.screen_name
	};
});

export const Settings = model<ISettings, SettingsModel>('Settings', SettingsSchema);
