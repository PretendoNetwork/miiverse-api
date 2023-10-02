import crypto from 'node:crypto';
import moment from 'moment';
import { Schema, model } from 'mongoose';
import { HydratedPostDocument, IPost, IPostMethods, PostModel } from '@/types/mongoose/post';
import { HydratedCommunityDocument } from '@/types/mongoose/community';
import { PostToJSONOptions } from '@/types/mongoose/post-to-json-options';
import { PostData, PostPainting, PostScreenshot, PostTopicTag } from '@/types/miiverse/post';

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


PostSchema.method<HydratedPostDocument>('del', async function del(reason: string) {
	this.removed = true;
	this.removed_reason = reason;
	await this.save();
});

PostSchema.method<HydratedPostDocument>('generatePostUID', async function generatePostUID(length: number) {
	const id = Buffer.from(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(length * 2))), 'binary').toString('base64').replace(/[+/]/g, '').substring(0, length);

	const inuse = await Post.findOne({ id });

	if (inuse) {
		await this.generatePostUID(length);
	} else {
		this.id = id;
	}
});

PostSchema.method<HydratedPostDocument>('cleanedBody', function cleanedBody(): string {
	return this.body ? this.body.replace(/[^A-Za-z\d\s-_!@#$%^&*(){}+=,.<>/?;:'"[\]]/g, '').replace(/[\n\r]+/gm, '') : '';
});

PostSchema.method<HydratedPostDocument>('cleanedMiiData', function cleanedMiiData(): string {
	return this.mii.replace(/[^A-Za-z0-9+/=]/g, '').replace(/[\n\r]+/gm, '').trim();
});

PostSchema.method<HydratedPostDocument>('cleanedPainting', function cleanedPainting(): string {
	return this.painting.replace(/[\n\r]+/gm, '').trim();
});

PostSchema.method<HydratedPostDocument>('cleanedAppData', function cleanedAppData(): string {
	return this.app_data.replace(/[^A-Za-z0-9+/=]/g, '').replace(/[\n\r]+/gm, '').trim();
});

PostSchema.method<HydratedPostDocument>('formatPainting', function formatPainting(): PostPainting | undefined {
	if (this.painting) {
		return {
			format: 'tga',
			content: this.cleanedPainting(),
			size: this.painting.length,
			url: `https://pretendo-cdn.b-cdn.net/paintings/${this.pid}/${this.id}.png`
		};
	}
});

PostSchema.method<HydratedPostDocument>('formatScreenshot', function formatScreenshot(): PostScreenshot | undefined {
	if (this.screenshot && this.screenshot_length) {
		return {
			size: this.screenshot_length,
			url: `https://pretendo-cdn.b-cdn.net/screenshots/${this.pid}/${this.id}.jpg`
		};
	}
});

PostSchema.method<HydratedPostDocument>('formatTopicTag', function formatTopicTag(): PostTopicTag {
	return {
		name: this.topic_tag,
		title_id: this.title_id
	};
});

PostSchema.method<HydratedPostDocument>('json', function json(options: PostToJSONOptions, community?: HydratedCommunityDocument): PostData {
	const post: PostData = {
		app_data: undefined, // TODO - I try to keep these fields in the real order they show up in, but idk where this one goes
		body: this.cleanedBody(),
		community_id: this.community_id, // TODO - This sucks
		country_id: this.country_id,
		created_at: moment(this.created_at).format('YYYY-MM-DD HH:MM:SS'),
		feeling_id: this.feeling_id,
		id: this.id,
		is_autopost: this.is_autopost ? 1 : 0,
		is_community_private_autopost: this.is_community_private_autopost ? 1 : 0,
		is_spoiler: this.is_spoiler ? 1 : 0,
		is_app_jumpable: this.is_app_jumpable ? 1 : 0,
		empathy_count: this.empathy_count || 0,
		language_id: this.language_id,
		mii: undefined, // * Conditionally set later
		mii_face_url: undefined, // * Conditionally set later
		number: 0,
		painting: this.formatPainting(),
		pid: this.pid,
		platform_id: this.platform_id,
		region_id: this.region_id,
		reply_count: this.reply_count || 0,
		screen_name: this.screen_name,
		screenshot: this.formatScreenshot(),
		topic_tag: undefined, // * Conditionally set later
		title_id: this.title_id,
	};

	if (options.app_data) {
		post.app_data = this.cleanedAppData();
	}

	if (options.with_mii) {
		post.mii = this.cleanedMiiData();
		post.mii_face_url = this.mii_face_url;
	}

	if (options.topic_tag) {
		post.topic_tag = this.formatTopicTag();
	}

	if (community) {
		post.community_id = community.community_id;
	}

	return post;
});

PostSchema.pre('save', async function(next) {
	if (!this.id) {
		await this.generatePostUID(21);
	}

	next();
});

export const Post = model<IPost, PostModel>('Post', PostSchema);
