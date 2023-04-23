import crypto from 'node:crypto';
import { IncomingHttpHeaders } from 'node:http';
import NodeRSA from 'node-rsa';
import fs from 'fs-extra';
import TGA from 'tga';
import pako from 'pako';
import { PNG } from 'pngjs';
import aws from 'aws-sdk';
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { ParsedQs } from 'qs';
import { LOG_ERROR } from '@/logger';
import { SafeQs } from '@/types/common/safe-qs';
import { ParamPack } from '@/types/common/param-pack';
import { config } from '@/config-manager';
import { CryptoOptions } from '@/types/common/crypto-options';

import { FriendsClient, FriendsDefinition } from 'pretendo-grpc-ts/dist/friends/friends_service';
import { GetUserFriendPIDsResponse } from 'pretendo-grpc-ts/dist/friends/get_user_friend_pids_rpc';
import { GetUserFriendRequestsIncomingResponse } from 'pretendo-grpc-ts/dist/friends/get_user_friend_requests_incoming_rpc';
import { FriendRequest } from 'pretendo-grpc-ts/dist/friends/friend_request';

const { ip, port, api_key } = config.grpc.friends;

const gRPCChannel = createChannel(`${ip}:${port}`); // * nice-grpc doesn't export ChannelImplementation so this can't be typed
const gRPCFriendsClient: FriendsClient = createClient(FriendsDefinition, gRPCChannel);

const s3: aws.S3 = new aws.S3({
	endpoint: new aws.Endpoint(config.s3.endpoint),
	accessKeyId: config.s3.key,
	secretAccessKey: config.s3.secret
});

export function decodeParamPack(paramPack: string): ParamPack {
	const values: string[] = Buffer.from(paramPack, 'base64').toString().split('\\');
	const entries: string[][] = values.filter(value => value).reduce((entries: string[][], value: string, index: number) => {
		if (0 === index % 2) {
			entries.push([ value ]);
		} else {
			entries[Math.ceil(index / 2 - 1)].push(value);
		}

		return entries;
	}, []);

	return Object.fromEntries(entries);
}

export function getPIDFromServiceToken(token: string): number {
	try {
		const decoded: Buffer = Buffer.from(token, 'base64');
		const decryptedToken: Buffer | null = decryptToken(decoded);

		if (!decryptedToken) {
			return 0;
		}

		return decryptedToken.readUInt32LE(0x2);
	} catch (e) {
		return 0;
	}
}

export function decryptToken(token: Buffer): Buffer | null {
	const cryptoPath: string = `${__dirname}/../certs/access`;

	// Access and refresh tokens use a different format since they must be much smaller
	// Assume a small length means access or refresh token
	if (token.length <= 32) {
		const aesKey: Buffer = Buffer.from(fs.readFileSync(`${cryptoPath}/aes.key`, { encoding: 'utf8' }), 'hex');

		const iv: Buffer = Buffer.alloc(16);

		const decipher: crypto.Decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, iv);

		return Buffer.concat([
			decipher.update(token),
			decipher.final()
		]);
	}

	const cryptoOptions: CryptoOptions = {
		private_key: fs.readFileSync(`${cryptoPath}/private.pem`),
		hmac_secret: config.account_server_secret
	};

	const privateKey: NodeRSA = new NodeRSA(cryptoOptions.private_key, 'pkcs1-private-pem', {
		environment: 'browser',
		encryptionScheme: {
			scheme: 'pkcs1_oaep',
			hash: 'sha256'
		}
	});

	const cryptoConfig: Buffer = token.subarray(0, 0x82);
	const signature: Buffer = token.subarray(0x82, 0x96);
	const encryptedBody: Buffer = token.subarray(0x96);

	const encryptedAESKey: Buffer = cryptoConfig.subarray(0, 128);
	const point1: number = cryptoConfig.readInt8(0x80);
	const point2: number = cryptoConfig.readInt8(0x81);

	const iv: Buffer = Buffer.concat([
		Buffer.from(encryptedAESKey.subarray(point1, point1 + 8)),
		Buffer.from(encryptedAESKey.subarray(point2, point2 + 8))
	]);

	try {
		const decryptedAESKey: Buffer = privateKey.decrypt(encryptedAESKey);

		const decipher: crypto.Decipher = crypto.createDecipheriv('aes-128-cbc', decryptedAESKey, iv);

		const decryptedBody: Buffer = Buffer.concat([
			decipher.update(encryptedBody),
			decipher.final()
		]);

		const hmac: crypto.Hmac = crypto.createHmac('sha1', cryptoOptions.hmac_secret).update(decryptedBody);
		const calculatedSignature: Buffer = hmac.digest();

		if (Buffer.compare(calculatedSignature, signature) !== 0) {
			LOG_ERROR('Token signature did not match');
			return null;
		}

		return decryptedBody;
	} catch (error) {
		LOG_ERROR('Failed to decrypt token. Probably a NNID from the topics request');
		return null;
	}
}

export function processPainting(painting: string): Buffer | null {
	const paintingBuffer: Buffer = Buffer.from(painting, 'base64');
	let output: Uint8Array;

	try {
		output = pako.inflate(paintingBuffer);
	} catch (error) {
		console.error(error);
		return null;
	}

	const tga = new TGA(Buffer.from(output));
	const png: PNG = new PNG({
		width: tga.width,
		height: tga.height
	});

	png.data = tga.pixels;

	return PNG.sync.write(png);
}

export async function uploadCDNAsset(bucket: string, key: string, data: Buffer, acl: string): Promise<void> {
	const awsPutParams: aws.S3.PutObjectRequest = {
		Body: data,
		Key: key,
		Bucket: bucket,
		ACL: acl
	};

	await s3.putObject(awsPutParams).promise();
}

export async function getUserFriendPIDs(pid: number): Promise<number[]> {
	const response: GetUserFriendPIDsResponse = await gRPCFriendsClient.getUserFriendPIDs({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': api_key
		})
	});

	return response.pids;
}

export async function getUserFriendRequestsIncoming(pid: number): Promise<FriendRequest[]> {
	const requests: GetUserFriendRequestsIncomingResponse = await gRPCFriendsClient.getUserFriendRequestsIncoming({
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