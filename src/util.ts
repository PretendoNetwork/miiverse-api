import crypto from 'node:crypto';
import { IncomingHttpHeaders } from 'node:http';
import NodeRSA from 'node-rsa';
import fs from 'fs-extra';
import TGA from 'tga';
import pako from 'pako';
import { PNG } from 'pngjs';
import bmp from 'bmp-js';
import aws from 'aws-sdk';
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { FriendsDefinition } from 'pretendo-grpc-ts/src/friends/friends_service';
import { ParsedQs } from 'qs';
import { getPNID } from '@/database';
import { LOG_ERROR } from '@/logger';
import { Settings } from '@/models/settings';
import { Content } from '@/models/content';
import { SafeQs } from '@/types/common/safe-qs';
import { ParamPack } from '@/types/common/param-pack';

import { config } from '@/config-manager';

const { ip, port, api_key } = config.grpc.friends;
const channel = createChannel(`${ip}:${port}`);
const client = createClient(FriendsDefinition, channel);

const s3 = new aws.S3({
	endpoint: new aws.Endpoint(config.s3.endpoint),
	accessKeyId: config.s3.key,
	secretAccessKey: config.s3.secret
});

export async function create_user(pid, experience, notifications, region) {
	const pnid = await getPNID(pid);
	if (!pnid) {
		return;
	}
	const newSettings = {
		pid: pid,
		screen_name: pnid.mii.name,
		game_skill: experience,
		receive_notifications: notifications,
	};
	const newContent = {
		pid: pid
	};
	const newSettingsObj = new Settings(newSettings);
	await newSettingsObj.save();

	const newContentObj = new Content(newContent);
	await newContentObj.save();
}

export function decodeParamPack(paramPack): ParamPack {
	/*  Decode base64 */
	const dec = Buffer.from(paramPack, 'base64').toString('ascii').slice(1, -1).split('\\');
	/*  Remove starting and ending '/', split into array */
	/*  Parameters are in the format [name, val, name, val]. Copy into out{}. */
	const out = {};
	for (let i = 0; i < dec.length; i += 2) {
		out[dec[i].trim()] = dec[i + 1].trim();
	}
	return out as ParamPack;
}

export function processServiceToken(token) {
	try {
		const B64token = Buffer.from(token, 'base64');
		const decryptedToken = this.decryptToken(B64token);
		return decryptedToken.readUInt32LE(0x2);
	} catch (e) {
		return null;
	}
}

export function decryptToken(token) {
	// Access and refresh tokens use a different format since they must be much smaller
	// Assume a small length means access or refresh token
	if (token.length <= 32) {
		const cryptoPath = `${__dirname}/../certs/access`;
		const aesKey = Buffer.from(fs.readFileSync(`${cryptoPath}/aes.key`, { encoding: 'utf8' }), 'hex');

		const iv = Buffer.alloc(16);

		const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, iv);

		let decryptedBody = decipher.update(token);
		decryptedBody = Buffer.concat([decryptedBody, decipher.final()]);

		return decryptedBody;
	}

	const cryptoPath = `${__dirname}/../certs/access`;

	const cryptoOptions = {
		private_key: fs.readFileSync(`${cryptoPath}/private.pem`),
		hmac_secret: config.account_server_secret
	};

	const privateKey = new NodeRSA(cryptoOptions.private_key, 'pkcs1-private-pem', {
		environment: 'browser',
		encryptionScheme: {
			scheme: 'pkcs1_oaep',
			hash: 'sha256'
		}
	});

	const cryptoConfig = token.subarray(0, 0x82);
	const signature = token.subarray(0x82, 0x96);
	const encryptedBody = token.subarray(0x96);

	const encryptedAESKey = cryptoConfig.subarray(0, 128);
	const point1 = cryptoConfig.readInt8(0x80);
	const point2 = cryptoConfig.readInt8(0x81);

	const iv = Buffer.concat([
		Buffer.from(encryptedAESKey.subarray(point1, point1 + 8)),
		Buffer.from(encryptedAESKey.subarray(point2, point2 + 8))
	]);

	try {
		const decryptedAESKey = privateKey.decrypt(encryptedAESKey);

		const decipher = crypto.createDecipheriv('aes-128-cbc', decryptedAESKey, iv);

		let decryptedBody = decipher.update(encryptedBody);
		decryptedBody = Buffer.concat([decryptedBody, decipher.final()]);

		const hmac = crypto.createHmac('sha1', cryptoOptions.hmac_secret).update(decryptedBody);
		const calculatedSignature = hmac.digest();

		if (Buffer.compare(calculatedSignature, signature) !== 0) {
			LOG_ERROR('Token signature did not match');
			return null;
		}

		return decryptedBody;
	} catch (e) {
		LOG_ERROR('Failed to decrypt token. Probably a NNID from the topics request');
		return null;
	}
}

export async function processPainting(painting, isTGA) {
	if (isTGA) {
		const paintingBuffer = Buffer.from(painting, 'base64');
		let output;
		try {
			output = pako.inflate(paintingBuffer);
		} catch (err) {
			console.error(err);
		}
		const tga = new TGA(Buffer.from(output));
		const png = new PNG({
			width: tga.width,
			height: tga.height
		});
		png.data = tga.pixels;
		return PNG.sync.write(png);
		//return `data:image/png;base64,${pngBuffer.toString('base64')}`;
	} else {
		const paintingBuffer = Buffer.from(painting, 'base64');
		const bitmap = bmp.decode(paintingBuffer);
		const tga = this.createBMPTgaBuffer(bitmap.width, bitmap.height, bitmap.data, false);

		let output;
		try {
			output = pako.deflate(tga, {level: 6});
		} catch (err) {
			console.error(err);
		}

		return new Buffer(output).toString('base64');
	}
}

export function nintendoPasswordHash(password, pid) {
	const pidBuffer = Buffer.alloc(4);
	pidBuffer.writeUInt32LE(pid);

	const unpacked = Buffer.concat([
		pidBuffer,
		Buffer.from('\x02\x65\x43\x46'),
		Buffer.from(password)
	]);
	return crypto.createHash('sha256').update(unpacked).digest().toString('hex');
}

export function createBMPTgaBuffer(width, height, pixels, dontFlipY) {
	const buffer = Buffer.alloc(18 + pixels.length);
	// write header
	buffer.writeInt8(0, 0);
	buffer.writeInt8(0, 1);
	buffer.writeInt8(2, 2);
	buffer.writeInt16LE(0, 3);
	buffer.writeInt16LE(0, 5);
	buffer.writeInt8(0, 7);
	buffer.writeInt16LE(0, 8);
	buffer.writeInt16LE(0, 10);
	buffer.writeInt16LE(width, 12);
	buffer.writeInt16LE(height, 14);
	buffer.writeInt8(32, 16);
	buffer.writeInt8(8, 17);

	let offset = 18;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			const idx = ((dontFlipY ? i : height - i - 1) * width + j) * 4;
			buffer.writeUInt8(pixels[idx + 1], offset++);    // b
			buffer.writeUInt8(pixels[idx + 2], offset++);    // g
			buffer.writeUInt8(pixels[idx + 3], offset++);    // r
			buffer.writeUInt8(255, offset++);          // a
		}
	}

	return buffer;
}

export async function uploadCDNAsset(bucket, key, data, acl) {
	const awsPutParams = {
		Body: data,
		Key: key,
		Bucket: bucket,
		ACL: acl
	};

	await s3.putObject(awsPutParams).promise();
}

export async function getFriends(pid) {
	return await client.getUserFriendPIDs({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': api_key
		})
	});
}

export async function getFriendRequests(pid) {
	const requests = await client.getUserFriendRequestsIncoming({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': api_key
		})
	});
	return requests.friendRequests;
}

export function makeSafeQs(query: ParsedQs): SafeQs {
	const entries = Object.entries(query);
	const output: SafeQs = {};

	for (const [key, value] of entries) {
		if (typeof value !== 'string') {
			// * ignore non-strings
			continue;
		}

		output[key] = value;
	}

	return output;
}

export function getValueFromQueryString(qs: ParsedQs, key: string): string | undefined {
	let property: string | ParsedQs | string[] | ParsedQs[] | SafeQs | undefined = qs[key];
	let value: string | undefined;

	if (property) {
		if (Array.isArray(property)) {
			property = property[0];
		}

		if (typeof property !== 'string') {
			property = makeSafeQs(<ParsedQs>property);
			value = (<SafeQs>property)[key];
		} else {
			value = <string>property;
		}
	}

	return value;
}

export function getValueFromHeaders(headers: IncomingHttpHeaders, key: string): string | undefined {
	let header: string | string[] | undefined = headers[key];
	let value: string | undefined;

	if (header) {
		if (Array.isArray(header)) {
			header = header[0];
		}

		value = header;
	}

	return value;
}

export function mapToObject(map: Map<any, any>): object {
	return Object.fromEntries(Array.from(map.entries(), ([ k, v ]) => v instanceof Map ? [ k, mapToObject(v) ] : [ k, v ]));
}