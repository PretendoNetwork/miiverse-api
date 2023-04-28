import express from 'express';
import multer from 'multer';
import { Snowflake } from 'node-snowflake';
import moment from 'moment';
import xmlbuilder from 'xmlbuilder';
import { z } from 'zod';
import { ParsedQs } from 'qs';
import { GetUserDataResponse } from 'pretendo-grpc-ts/dist/account/get_user_data_rpc';
import { getUserFriendPIDs, getUserAccountData, processPainting, uploadCDNAsset, getValueFromQueryString } from '@/util';
import { getConversationByUsers, getUserSettings, getFriendMessages } from '@/database';
import { LOG_WARN } from '@/logger';
import { Post } from '@/models/post';
import { Conversation } from '@/models/conversation';
import { SendMessageBody } from '@/types/common/send-message-body';
import { FormattedMessage } from '@/types/common/formatted-message';
import { HydratedConversationDocument } from '@/types/mongoose/conversation';
import { HydratedSettingsDocument } from '@/types/mongoose/settings';
import { HydratedPostDocument } from '@/types/mongoose/post';

const sendMessageSchema = z.object({
	message_to_pid: z.string().transform(Number),
	body: z.string(),
	painting: z.string().optional(),
	screenshot: z.string().optional(),
	app_data: z.string().optional()
});

const router: express.Router = express.Router();
const upload: multer.Multer = multer();

router.post('/', upload.none(), async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	// TODO - Better error codes, maybe do defaults?
	const bodyCheck: z.SafeParseReturnType<SendMessageBody, SendMessageBody> = sendMessageSchema.safeParse(request.body);

	if (!bodyCheck.success) {
		response.status(422);
		return;
	}

	const recipientPID: number = bodyCheck.data.message_to_pid;
	let messageBody: string = bodyCheck.data.body;
	const painting: string = bodyCheck.data.painting?.replace(/\0/g, '').trim() || '';
	const screenshot: string = bodyCheck.data.screenshot?.trim().replace(/\0/g, '').trim() || '';
	const appData: string = bodyCheck.data.app_data?.replace(/[^A-Za-z0-9+/=\s]/g, '').trim() || '';

	if (isNaN(recipientPID)) {
		response.status(422);
		return;
	}

	let sender: GetUserDataResponse;

	try {
		sender = await getUserAccountData(request.pid);
	} catch (error) {
		// TODO - Log this error
		response.status(422);
		return;
	}

	if (!sender.mii) {
		// * This should never happen, but TypeScript complains so check anyway
		// TODO - Better errors
		response.status(422);
		return;
	}

	let recipient: GetUserDataResponse;

	try {
		recipient = await getUserAccountData(request.pid);
	} catch (error) {
		// TODO - Log this error
		response.status(422);
		return;
	}

	let conversation: HydratedConversationDocument | null = await getConversationByUsers([sender.pid, recipient.pid]);

	if (!conversation) {
		const userSettings: HydratedSettingsDocument | null = await getUserSettings(request.pid);
		const user2Settings: HydratedSettingsDocument | null = await getUserSettings(recipient.pid);

		if (!sender || !recipient || userSettings || user2Settings) {
			response.sendStatus(422);
			return;
		}

		conversation = await Conversation.create({
			id: Snowflake.nextId(),
			users: [
				{
					pid: sender.pid,
					official: (sender.accessLevel === 2 || sender.accessLevel === 3),
					read: true
				},
				{
					pid: recipient.pid,
					official: (recipient.accessLevel === 2 || recipient.accessLevel === 3),
					read: false
				},
			]
		});
	}

	if (!conversation) {
		response.sendStatus(404);
		return;
	}

	const friendPIDs: number[] = await getUserFriendPIDs(recipient.pid);

	if (friendPIDs.indexOf(request.pid) === -1) {
		response.sendStatus(422);
		return;
	}

	let miiFace: string = 'normal_face.png';
	switch (parseInt(request.body.feeling_id)) {
		case 1:
			miiFace = 'smile_open_mouth.png';
			break;
		case 2:
			miiFace = 'wink_left.png';
			break;
		case 3:
			miiFace = 'surprise_open_mouth.png';
			break;
		case 4:
			miiFace = 'frustrated.png';
			break;
		case 5:
			miiFace = 'sorrow.png';
			break;
	}

	if (messageBody) {
		messageBody = messageBody.replace(/[^A-Za-z\d\s-_!@#$%^&*(){}‛¨ƒºª«»“”„¿¡←→↑↓√§¶†‡¦–—⇒⇔¤¢€£¥™©®+×÷=±∞ˇ˘˙¸˛˜′″µ°¹²³♭♪•…¬¯‰¼½¾♡♥●◆■▲▼☆★♀♂,./?;:'"\\<>]/g, '');
	}

	if (messageBody.length > 280) {
		messageBody = messageBody.substring(0, 280);
	}

	if (messageBody === '' && painting === '' && screenshot === '') {
		response.status(422);
		response.redirect(`/friend_messages/${conversation.id}`);
		return;
	}

	const post = await Post.create({
		title_id: request.paramPack.title_id,
		community_id: conversation.id,
		screen_name: sender.mii.name,
		body: messageBody,
		app_data: appData,
		painting: painting,
		screenshot: '',
		screenshot_length: 0,
		country_id: request.paramPack.country_id,
		created_at: new Date(),
		feeling_id: request.body.feeling_id,
		search_key: request.body.search_key,
		topic_tag: request.body.topic_tag,
		is_autopost: request.body.is_autopost,
		is_spoiler: (request.body.spoiler) ? 1 : 0,
		is_app_jumpable: request.body.is_app_jumpable,
		language_id: request.body.language_id,
		mii: sender.mii.data,
		mii_face_url: `https://mii.olv.pretendo.cc/mii/${sender.pid}/${miiFace}`,
		pid: request.pid,
		platform_id: request.paramPack.platform_id,
		region_id: request.paramPack.region_id,
		verified: (sender.accessLevel === 2 || sender.accessLevel === 3),
		message_to_pid: request.body.message_to_pid,
		parent: null,
		removed: false
	});

	if (painting) {
		const paintingBuffer: Buffer | null = await processPainting(painting);

		if (paintingBuffer) {
			await uploadCDNAsset('pn-cdn', `paintings/${request.pid}/${post.id}.png`, paintingBuffer, 'public-read');
		} else {
			LOG_WARN(`PAINTING FOR POST ${post.id} FAILED TO PROCESS`);
		}
	}

	if (screenshot) {
		const screenshotBuffer: Buffer = Buffer.from(screenshot, 'base64');

		await uploadCDNAsset('pn-cdn', `screenshots/${request.pid}/${post.id}.jpg`, screenshotBuffer, 'public-read');

		post.screenshot = `/screenshots/${request.pid}/${post.id}.jpg`;
		post.screenshot_length = screenshot.length;

		await post.save();
	}

	let postPreviewText = messageBody;
	if (painting) {
		postPreviewText = 'sent a Drawing';
	} else if (messageBody.length > 25) {
		postPreviewText = messageBody.substring(0, 25) + '...';
	}

	await conversation.newMessage(postPreviewText, recipientPID);

	response.sendStatus(200);
});

router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	const limitString: string | undefined = getValueFromQueryString(request.query, 'limit');

	// TODO - Is this the limit?
	let limit: number = 10;

	if (limitString) {
		limit = parseInt(limitString);
	}

	if (isNaN(limit)) {
		limit = 10;
	}

	// TODO - Update getValueFromQueryString to return arrays optionally
	const searchKey: string | ParsedQs | string[] | ParsedQs[] | undefined = request.query.search_key;

	if (!searchKey) {
		response.sendStatus(404);
		return;
	}

	const messages: HydratedPostDocument[] = await getFriendMessages(request.pid.toString(), searchKey as string[], limit);

	const postBody: FormattedMessage[] = [];
	for (const message of messages) {
		console.log(message);
		postBody.push({
			post: {
				body: message.body,
				country_id: message.country_id || 0,
				created_at: moment(message.created_at).format('YYYY-MM-DD HH:MM:SS'),
				feeling_id: message.feeling_id || 0,
				id: message.id,
				is_autopost: message.is_autopost,
				is_spoiler: message.is_spoiler,
				is_app_jumpable: message.is_app_jumpable,
				empathy_added: message.empathy_count,
				language_id: message.language_id,
				message_to_pid: message.message_to_pid,
				mii: message.mii,
				mii_face_url: message.mii_face_url,
				number: message.number || 0,
				pid: message.pid,
				platform_id: message.platform_id || 0,
				region_id: message.region_id || 0,
				reply_count: message.reply_count,
				screen_name: message.screen_name,
				topic_tag: {
					name: message.topic_tag,
					title_id: 0
				},
				title_id: message.title_id
			}
		});
	}

	response.send(xmlbuilder.create({
		result: {
			has_error: 0,
			version: 1,
			request_name: 'friend_messages',
			posts: postBody
		}
	}, { separateArrayItems: true }).end({ pretty: true }));
});

router.post('/:post_id/empathies', upload.none(), async function (_request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');
	// TODO - FOR JEMMA! FIX THIS! MISSING MONGOOSE SCHEMA METHODS
	// * Remove the underscores from request and response to make them seen by eslint again
	/*
	let pid = getPIDFromServiceToken(req.headers["x-nintendo-servicetoken"]);
	const post = await getPostByID(req.params.post_id);
	if(pid === null) {
		res.sendStatus(403);
		return;
	}
	let user = await getUserByPID(pid);
	if(user.likes.indexOf(post.id) === -1 && user.id !== post.pid)
	{
		post.upEmpathy();
		user.addToLikes(post.id)
		res.sendStatus(200);
	}
	else
		res.sendStatus(403);
	*/
});

export default router;