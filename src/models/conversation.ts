import { Schema, model } from 'mongoose';
import { Snowflake } from 'node-snowflake';
import { IConversation, IConversationMethods, ConversationModel, HydratedConversationDocument } from '@/types/mongoose/conversation';

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

ConversationSchema.method<HydratedConversationDocument>('newMessage', async function newMessage(message: string, senderPID: number) {
	if (this.users[0].pid === senderPID) {
		this.users[1].read = false;
		this.markModified('users[1].read');
	} else {
		this.users[0].read = false;
		this.markModified('users[0].read');
	}

	this.last_updated = new Date();
	this.message_preview = message;

	await this.save();
});

export const Conversation = model<IConversation, ConversationModel>('Conversation', ConversationSchema);