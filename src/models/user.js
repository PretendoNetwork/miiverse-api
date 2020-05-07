const { Schema, model } = require('mongoose');

const  UserSchema = new Schema({
    pid: Number,
    created_at: String,
    user_id: String,
    /**
     * Account Status
     * 0 - Fine
     * 1 - Limited from Posting
     * 2 - Temporary Ban
     * 3 - Forever Ban
     */
    account_status: {
        type: Number,
        default: 0
    },
    mii: String,
    official: {
        type: Boolean,
        default: false
    }
});

const USER = model('USER', UserSchema);

module.exports = {
    UserSchema,
    USER
};