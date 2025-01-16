import type { Model, Types, HydratedDocument } from 'mongoose';

export type NotificationUser = {
	user: string;
	timestamp: number;
};

export interface INotification {
	pid: string;
	type: string;
	link: string;
	objectID: string;
	users: Types.Array<NotificationUser>;
	read: boolean;
	lastUpdated: number;
}

export type NotificationModel = Model<INotification>;

export type HydratedNotificationDocument = HydratedDocument<INotification>;
