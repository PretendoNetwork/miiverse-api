import type { Model, Types, HydratedDocument } from 'mongoose';

export type ConversationUser = {
	pid: number;
	official: boolean;
	read: boolean;
};

export interface IConversation {
	id: string;
	created_at: Date;
	last_updated: Date;
	message_preview: string;
	users: Types.Array<ConversationUser>;
}

export interface IConversationMethods {
	newMessage(message: string, senderPID: number): Promise<void>;
}

export type ConversationModel = Model<IConversation, object, IConversationMethods>;

export type HydratedConversationDocument = HydratedDocument<IConversation, IConversationMethods>;
