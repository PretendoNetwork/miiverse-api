const { Schema, model } = require('mongoose');

const  ConversationSchema = new Schema({
    created_at: {
        type: Date,
        default: new Date(),
    },
    id: {
        type: String,
        default: 0
    },
    pids: [Number],
});

ConversationSchema.methods.addUser = async function(pid) {
    const conversation = this.get('pids');
    conversation.addToSet(pid);
    await this.save();
}

ConversationSchema.methods.removeUser = async function(pid) {
    const conversation = this.get('pids');
    conversation.pull(pid);
    await this.save();
}

const CONVERSATION = model('CONVERSATION', ConversationSchema);

module.exports = {
    ConversationSchema: ConversationSchema,
    CONVERSATION: CONVERSATION
};