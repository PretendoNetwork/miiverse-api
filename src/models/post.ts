import { Schema, model } from 'mongoose';
import { IPost, IPostMethods, PostModel } from '@/types/mongoose/post';

const PostSchema = new Schema<IPost, PostModel, IPostMethods>({
    id: String,
    title_id: String,
    screen_name: String,
    body: String,
    app_data: String,
    painting: String,
    screenshot: String,
    screenshot_length: Number,
    search_key: {
        type: [String],
        default: undefined
    },
    topic_tag: {
        type: String,
        default: undefined
    },
    community_id: {
        type: String,
        default: undefined
    },
    created_at: Date,
    feeling_id: Number,
    is_autopost: {
        type: Number,
        default: 0
    },
    is_community_private_autopost: {
        type: Number,
        default: 0
    },
    is_spoiler: {
        type: Number,
        default: 0
    },
    is_app_jumpable: {
        type: Number,
        default: 0
    },
    empathy_count: {
        type: Number,
        default: 0,
        min: 0
    },
    country_id: {
        type: Number,
        default: 49
    },
    language_id: {
        type: Number,
        default: 1
    },
    mii: String,
    mii_face_url: String,
    pid: Number,
    platform_id: Number,
    region_id: Number,
    parent: String,
    reply_count: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    message_to_pid: {
        type: String,
        default: null
    },
    removed: {
        type: Boolean,
        default: false
    },
    removed_reason: String,
    yeahs: [Number],
    number: Number
});

PostSchema.method('upReply', async function upReply() {
    const replyCount = this.get('reply_count');
    if(replyCount + 1 < 0)
        this.set('reply_count', 0);
    else
        this.set('reply_count', replyCount + 1);

    await this.save();
});

PostSchema.method('downReply', async function downReply() {
    const replyCount = this.get('reply_count');
    if(replyCount - 1 < 0)
        this.set('reply_count', 0);
    else
        this.set('reply_count', replyCount - 1);

    await this.save();
});

PostSchema.method('remove', async function remove(reason) {
    this.set('remove', true);
    this.set('removed_reason', reason)
    await this.save();
});

PostSchema.method('unRemove', async function unRemove(reason) {
    this.set('remove', false);
    this.set('removed_reason', reason)
    await this.save();
});

export const Post: PostModel = model<IPost, PostModel>('Post', PostSchema);
