const { Schema, model } = require('mongoose');

const  NotificationsSchema = new Schema({
    pid: String,
    /**
     * 0 like
     * 1 reply
     * 2 new follower
     * 3 other
     */
    type: Number,
    title: String,
    content: String,
    reference_id: String,
    link: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    read: {
        type: Boolean,
        default: false
    },
    origin_pid: String,
});

NotificationsSchema.methods.markRead = async function() {
    this.set('read', true);
    await this.save();
};

const NOTIFICATION = model('NOTIFICATION', NotificationsSchema);

module.exports = {
    NotificationsSchema,
    NOTIFICATION
};
