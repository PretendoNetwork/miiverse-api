import { Schema, model } from 'mongoose';
import moment from 'moment';
import { Snowflake } from 'node-snowflake';
import { IConversation, IConversationMethods, ConversationModel } from '@/types/mongoose/conversation';

const ConversationSchema = new Schema<IConversation, ConversationModel, IConversationMethods>({
	id: {
		type: String,
		default: Snowflake.nextId()
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
		default: ''
	},
	users: [{
		pid: Number,
		official: {
			type: Boolean,
			default: false
		},
		read: {
			type: Boolean,
			default: true
		}
	}]
});

ConversationSchema.method('newMessage', async function newMessage(message, senderPID) {
	if (this.users[0].pid === senderPID) {
		this.users[1].read = false;
		this.markModified('users[1].read');
	} else {
		this.users[0].read = false;
		this.markModified('users[0].read');
	}
	this.set('last_updated', moment(new Date()));
	this.set('message_preview', message);
	await this.save();
});

ConversationSchema.method('markAsRead', async function markAsRead(pid) {
	const users = this.get('users');
	if (users[0].pid === pid) {
		users[0].read = true;
	} else if (users[1].pid === pid) {
		users[1].read = true;
	}
	this.set('users', users);
	this.markModified('users');
	await this.save();
});

export const Conversation = model<IConversation, ConversationModel>('Conversation', ConversationSchema);