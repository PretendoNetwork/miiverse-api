const { Schema, model } = require('mongoose');
const snowflake = require('node-snowflake').Snowflake;

const  ConversationSchema = new Schema({
    id: {
        type: String,
        default: snowflake.nextId()
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    last_message_sent: {
        type: Date,
        default: new Date(),
    },
    message_preview: {
        type: String,
        default: ""
    },
    pid1: {
        pid: String,
        official: {
            type: Boolean,
            default: false
        },
        screen_name: String,
        read: Boolean
    },
    pid2: {
        pid: String,
        official: {
            type: Boolean,
            default: false
        },
        screen_name: String,
        read: Boolean
    }
});

ConversationSchema.methods.newMessage = async function(message, fromPid) {
    const pid1 = this.get('pid1');
    const pid2 = this.get('pid2');
    if(pid1.pid === fromPid) {
        pid1.read = true
        pid2.read = false
    }
    else {
        pid1.read = false
        pid2.read = true
    }
    this.set('pid1', pid1);
    this.set('pid2', pid2);
    this.set('last_message_sent', new Date());
    this.set('message_preview', message);
    await this.save();
}

const CONVERSATION = model('CONVERSATION', ConversationSchema);

module.exports = {
    ConversationSchema: ConversationSchema,
    CONVERSATION: CONVERSATION
};
