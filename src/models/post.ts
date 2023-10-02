import crypto from 'node:crypto';
import moment from 'moment';
import { Schema, model } from 'mongoose';
import { IPost, IPostMethods, PostModel } from '@/types/mongoose/post';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { PostToJSONOptions } from '@/types/mongoose/post-to-json-options';
import { PostPainting, PostScreenshot } from '@/types/common/post';

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
}, {
	id: false // * Disables the .id() getter used by Mongoose in TypeScript. Needed to have our own .id field
});

PostSchema.method('upReply', async function upReply() {
	const replyCount = this.get('reply_count');
	if (replyCount + 1 < 0) {
		this.set('reply_count', 0);
	} else {
		this.set('reply_count', replyCount + 1);
	}

	await this.save();
});

PostSchema.method('downReply', async function downReply() {
	const replyCount = this.get('reply_count');
	if (replyCount - 1 < 0) {
		this.set('reply_count', 0);
	} else {
		this.set('reply_count', replyCount - 1);
	}

	await this.save();
});

PostSchema.method('remove', async function remove(reason) {
	this.set('remove', true);
	this.set('removed_reason', reason);
	await this.save();
});

PostSchema.method('unRemove', async function unRemove(reason) {
	this.set('remove', false);
	this.set('removed_reason', reason);
	await this.save();
});

PostSchema.method('generatePostUID', async function generatePostUID(length: number) {
	const id = Buffer.from(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(length * 2))), 'binary').toString('base64').replace(/[+/]/g, '').substring(0, length);

	const inuse = await Post.findOne({ id });

	if (inuse) {
		await this.generatePostUID(length);
	} else {
		this.id = id;
	}
});

PostSchema.method('cleanedBody', function cleanedBody(): string {
	return this.body ? this.body.replace(/[^A-Za-z\d\s-_!@#$%^&*(){}+=,.<>/?;:'"[\]]/g, '').replace(/[\n\r]+/gm, '') : '';
});

PostSchema.method('cleanedMiiData', function cleanedMiiData(): string {
	return this.mii.replace(/[^A-Za-z0-9+/=]/g, '').replace(/[\n\r]+/gm, '').trim();
});

PostSchema.method('cleanedPainting', function cleanedPainting(): string {
	return this.painting.replace(/[\n\r]+/gm, '').trim();
});

PostSchema.method('cleanedAppData', function cleanedAppData(): string {
	return this.app_data.replace(/[^A-Za-z0-9+/=]/g, '').replace(/[\n\r]+/gm, '').trim();
});

PostSchema.method('formatPainting', function formatPainting(): PostPainting | undefined {
	if (this.painting) {
		return {
			format: 'tga',
			content: this.cleanedPainting(),
			size: this.painting.length,
			url: `https://pretendo-cdn.b-cdn.net/paintings/${this.pid}/${this.id}.png`
		};
	}
});

PostSchema.method('formatScreenshot', function formatScreenshot(): PostScreenshot | undefined {
	if (this.screenshot && this.screenshot_length) {
		return {
			size: this.screenshot_length,
			url: `https://pretendo-cdn.b-cdn.net/screenshots/${this.pid}/${this.id}.jpg`
		};
	}
});

PostSchema.method('json', function json(options: PostToJSONOptions, community?: HydratedCommunityDocument): Record<string, any> {
	const json: Record<string, any> = {
		body: this.cleanedBody(),
		country_id: this.country_id ? this.country_id : 254,
		created_at: moment(this.created_at).format('YYYY-MM-DD HH:MM:SS'),
		feeling_id: this.feeling_id,
		id: this.id,
		is_autopost: this.is_autopost,
		is_community_private_autopost: this.is_community_private_autopost,
		is_spoiler: this.is_spoiler,
		is_app_jumpable: this.is_app_jumpable,
		empathy_count: this.empathy_count,
		language_id: this.language_id,
		number: '0',
		pid: this.pid,
		platform_id: this.platform_id,
		region_id: this.region_id,
		reply_count: this.reply_count,
		screen_name: this.screen_name,
		title_id: this.title_id
	};

	if (this.app_data && options.app_data) {
		json.app_data = this.cleanedAppData();
	}

	if (options.topics && community) {
		json.community_id = community.community_id;
	} else {
		json.community_id = this.community_id;
	}

	if (options.with_mii) {
		json.mii = this.cleanedMiiData();
		json.mii_face_url = this.mii_face_url;
	}

	if (this.painting) {
		json.painting = this.formatPainting();
	}

	if (this.screenshot && this.screenshot_length) {
		json.screenshot = this.formatScreenshot();
	}

	if (this.topic_tag && options.topic_tag) {
		json.topic_tag = {
			name: this.topic_tag,
			title_id: this.title_id
		};
	}

	return json;
});

PostSchema.pre('save', async function(next) {
	if (!this.id) {
		await this.generatePostUID(21);
	}

	next();
});

export const Post = model<IPost, PostModel>('Post', PostSchema);
