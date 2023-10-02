import { Schema, model } from 'mongoose';
import { HydratedNotificationDocument, INotification, INotificationMethods, NotificationModel } from '@/types/mongoose/notification';

const NotificationSchema = new Schema<INotification, NotificationModel, INotificationMethods>({
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

NotificationSchema.method<HydratedNotificationDocument>('markRead', async function markRead() {
	this.read = true;
	await this.save();
});

export const Notification = model<INotification, NotificationModel>('Notification', NotificationSchema);
