import { Schema, model } from 'mongoose';
import type { INotification, NotificationModel } from '@/types/mongoose/notification';

const NotificationSchema = new Schema<INotification, NotificationModel>({
	pid: String,
	type: String,
	link: String,
	objectID: String,
	users: [{
		user: String,
		timestamp: Date
	}],
	read: Boolean,
	lastUpdated: Date
});

export const Notification = model<INotification, NotificationModel>('Notification', NotificationSchema);
