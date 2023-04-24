import { Model, Types, HydratedDocument } from 'mongoose';

export interface IPost {
	id: string;
    title_id: string;
    screen_name: string;
    body: string;
    app_data: string;
    painting: string;
    screenshot: string;
    screenshot_length: number;
    search_key: string[];
    topic_tag: string;
    community_id: string;
    created_at: Date;
    feeling_id: number;
    is_autopost: number;
    is_community_private_autopost?: number;
    is_spoiler: number;
    is_app_jumpable: number;
    empathy_count?: number;
    country_id: number;
    language_id: number;
    mii: string;
    mii_face_url: string;
    pid: number;
    platform_id: number;
    region_id: number;
    parent: string;
    reply_count?: number;
    verified: boolean;
    message_to_pid?: string;
    removed: boolean;
    removed_reason?: string;
    yeahs?: Types.Array<number>;
    number?: number;
}

export interface IPostMethods {
	upReply(): Promise<void>;
	downReply(): Promise<void>;
	remove(reason: string): Promise<void>;
	unRemove(reason: string): Promise<void>;
    generatePostUID(length: number): Promise<void>;
}

interface IPostQueryHelpers {}

export interface PostModel extends Model<IPost, IPostQueryHelpers, IPostMethods> {}

export type HydratedPostDocument = HydratedDocument<IPost, IPostMethods>