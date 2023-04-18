const { Schema, model } = require('mongoose');

const  NotificationSchema = new Schema({
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

NotificationSchema.methods.markRead = async function() {
    this.set('read', true);
    await this.save();
};

const NOTIFICATION = model('NOTIFICATION', NotificationSchema);

module.exports = {
    NotificationSchema,
    NOTIFICATION
};
