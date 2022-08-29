const { Schema, model } = require('mongoose');
const moment = require("moment");
const snowflake = require('node-snowflake').Snowflake;

const user = new Schema({
    pid: String,
    official: {
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: true
    }
});

const  ConversationSchema = new Schema({
    id: {
        type: String,
        default: snowflake.nextId()
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    last_updated: {
        type: Date,
        default: new Date(),
    },
    message_preview: {
        type: String,
        default: ""
    },
    users: [user]
});

ConversationSchema.methods.newMessage = async function(message, fromPid) {
    const users = this.get('users');
    console.log(fromPid)
    if(users[0].pid.toString() === fromPid.toString()) {;
        users[1].read = false;
    }
    else {
        users[0].read = false;
    }
    this.set('users', users);
    this.set('last_updated', moment(new Date()));
    this.set('message_preview', message);
    await this.save();
}

ConversationSchema.methods.markAsRead = async function(pid) {
    let users = this.get('users');
    if(users[0].pid === pid.toString())
        users[0].read = true;
    else if(users[1].pid === pid.toString())
        users[1].read = true;
    this.set('users', users)
    this.markModified('users');
    await this.save();
}

const CONVERSATION = model('CONVERSATION', ConversationSchema);

module.exports = {
    ConversationSchema: ConversationSchema,
    CONVERSATION: CONVERSATION
};
