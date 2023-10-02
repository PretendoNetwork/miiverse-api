import { Model, HydratedDocument } from 'mongoose';
import { SettingsData } from '@/types/miiverse/settings';

export interface ISettings {
	pid: number;
    screen_name: string;
    account_status: number;
    ban_lift_date: Date;
    ban_reason: string;
    profile_comment: string;
    profile_comment_visibility: boolean;
    game_skill: number;
    game_skill_visibility: boolean;
    birthday_visibility: boolean;
    relationship_visibility: boolean;
    country_visibility: boolean;
    profile_favorite_community_visibility: boolean;
    receive_notifications: boolean;
}

export interface ISettingsMethods {
	json(): SettingsData;
}

interface ISettingsQueryHelpers {}

export interface SettingsModel extends Model<ISettings, ISettingsQueryHelpers, ISettingsMethods> {}

export type HydratedSettingsDocument = HydratedDocument<ISettings, ISettingsMethods>