import crypto from 'node:crypto';
import { IncomingHttpHeaders } from 'node:http';
import TGA from 'tga';
import BMP from 'bmp-js';
import pako from 'pako';
import { PNG } from 'pngjs';
import aws from 'aws-sdk';
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { ParsedQs } from 'qs';
import crc32 from 'crc/crc32';
import { ParamPack } from '@/types/common/param-pack';
import { config } from '@/config-manager';
import { Token } from '@/types/common/token';

import { FriendsDefinition } from '@pretendonetwork/grpc/friends/friends_service';
import { FriendRequest } from '@pretendonetwork/grpc/friends/friend_request';

import { AccountDefinition } from '@pretendonetwork/grpc/account/account_service';
import { GetUserDataResponse } from '@pretendonetwork/grpc/account/get_user_data_rpc';

// * nice-grpc doesn't export ChannelImplementation so this can't be typed
const gRPCFriendsChannel = createChannel(`${config.grpc.friends.ip}:${config.grpc.friends.port}`);
const gRPCFriendsClient = createClient(FriendsDefinition, gRPCFriendsChannel);

const gRPCAccountChannel = createChannel(`${config.grpc.account.ip}:${config.grpc.account.port}`);
const gRPCAccountClient = createClient(AccountDefinition, gRPCAccountChannel);

const s3 = new aws.S3({
	endpoint: new aws.Endpoint(config.s3.endpoint),
	accessKeyId: config.s3.key,
	secretAccessKey: config.s3.secret
});

export function decodeParamPack(paramPack: string): ParamPack {
	const values = Buffer.from(paramPack, 'base64').toString().split('\\');
	const entries = values.filter(value => value).reduce((entries: string[][], value: string, index: number) => {
		if (0 === index % 2) {
			entries.push([value]);
		} else {
			entries[Math.ceil(index / 2 - 1)].push(value);
		}

		return entries;
	}, []);

	return Object.fromEntries(entries);
}

export function getPIDFromServiceToken(token: string): number {
	try {
		const decryptedToken = decryptToken(Buffer.from(token, 'base64'));

		if (!decryptedToken) {
			return 0;
		}

		const unpackedToken = unpackToken(decryptedToken);

		return unpackedToken.pid;
	} catch (e) {
		console.error(e);
		return 0;
	}
}

export function decryptToken(token: Buffer): Buffer {
	const iv = Buffer.alloc(16);

	const expectedChecksum = token.readUint32BE();
	const encryptedBody = token.subarray(4);

	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.aes_key, 'hex'), iv);

	const decrypted = Buffer.concat([
		decipher.update(encryptedBody),
		decipher.final()
	]);

	if (expectedChecksum !== crc32(decrypted)) {
		throw new Error('Checksum did not match. Failed decrypt. Are you using the right key?');
	}

	return decrypted;
}

export function unpackToken(token: Buffer): Token {
	return {
		system_type: token.readUInt8(0x0),
		token_type: token.readUInt8(0x1),
		pid: token.readUInt32LE(0x2),
		expire_time: token.readBigUInt64LE(0x6),
		title_id: token.readBigUInt64LE(0xE),
		access_level: token.readInt8(0x16)
	};
}

export function processPainting(painting: string): Buffer | null {
	const paintingBuffer = Buffer.from(painting, 'base64');
	let output: Uint8Array;

	try {
		output = pako.inflate(paintingBuffer);
	} catch (error) {
		console.error(error);
		return null;
	}

	// 3DS is a BMP, Wii U is a TGA. God isn't real so we need to edit the
	// alpha layer of the BMP to covert it to a PNG for the web app
	if (output[0] === 66) {
		const bitmap = BMP.decode(Buffer.from(output));
		const png = new PNG({
			width: bitmap.width,
			height: bitmap.height
		});

		const bpmBuffer = bitmap.getData();
		bpmBuffer.swap32();
		png.data = bpmBuffer;
		for (let i = 3; i < bpmBuffer.length; i += 4) {
			bpmBuffer[i] = 255;
		}
		return PNG.sync.write(png);
	} else {
		const tga = new TGA(Buffer.from(output));
		const png = new PNG({
			width: tga.width,
			height: tga.height
		});

		png.data = Buffer.from(tga.pixels);
		return PNG.sync.write(png);
	}
}

export async function uploadCDNAsset(bucket: string, key: string, data: Buffer, acl: string): Promise<void> {
	const awsPutParams = {
		Body: data,
		Key: key,
		Bucket: bucket,
		ACL: acl
	};

	await s3.putObject(awsPutParams).promise();
}

export async function getUserFriendPIDs(pid: number): Promise<number[]> {
	const response = await gRPCFriendsClient.getUserFriendPIDs({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': config.grpc.friends.api_key
		})
	});

	return response.pids;
}

export async function getUserFriendRequestsIncoming(pid: number): Promise<FriendRequest[]> {
	const response = await gRPCFriendsClient.getUserFriendRequestsIncoming({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': config.grpc.friends.api_key
		})
	});

	return response.friendRequests;
}

export function getUserAccountData(pid: number): Promise<GetUserDataResponse> {
	return gRPCAccountClient.getUserData({
		pid: pid
	}, {
		metadata: Metadata({
			'X-API-Key': config.grpc.account.api_key
		})
	});
}

export function getValueFromQueryString(qs: ParsedQs, key: string): string[] {
	const property = qs[key] as string | string[];

	if (property) {
		if (Array.isArray(property)) {
			return property;
		} else {
			return [property];
		}
	}

	return [];
}

export function getValueFromHeaders(headers: IncomingHttpHeaders, key: string): string | undefined {
	let header = headers[key];
	let value: string | undefined;

	if (header) {
		if (Array.isArray(header)) {
			header = header[0];
		}

		value = header;
	}

	return value;
}