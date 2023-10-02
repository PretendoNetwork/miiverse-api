import { Model, Types, HydratedDocument } from 'mongoose';

export type NotificationUser = {
	user: string;
    timestamp: number;
}

export interface INotification {
	pid: string;
    type: string;
    link: string;
    objectID: string;
    users: Types.Array<NotificationUser>;
    read: boolean;
    lastUpdated: number;
}

export interface INotificationMethods {}

interface INotificationQueryHelpers {}

export interface NotificationModel extends Model<INotification, INotificationQueryHelpers, INotificationMethods> {}

export type HydratedNotificationDocument = HydratedDocument<INotification, INotificationMethods>