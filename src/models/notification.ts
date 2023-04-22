import { Schema, model } from 'mongoose';
import { INotification, INotificationMethods, NotificationModel } from '@/types/mongoose/notification';

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

NotificationSchema.method('markRead', async function markRead() {
    this.set('read', true);
    await this.save();
});

export const Notification: NotificationModel = model<INotification, NotificationModel>('Notification', NotificationSchema);
