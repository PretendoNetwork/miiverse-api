import { Model, Types, HydratedDocument } from 'mongoose';

export type ConversationUser = {
	pid: number;
    official: boolean;
    read: boolean;
}

export interface IConversation {
	id: string;
    created_at: Date;
    last_updated: Date;
    message_preview: string,
    users: Types.Array<ConversationUser>;
}

export interface IConversationMethods {
	newMessage(message: string, senderPID: number): Promise<void>
	markAsRead(pid: number): Promise<void>
}

interface IConversationQueryHelpers {}

export interface ConversationModel extends Model<IConversation, IConversationQueryHelpers, IConversationMethods> {}

export type HydratedConversationDocument = HydratedDocument<IConversation, IConversationMethods>