/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from 'node:crypto';
import newman from 'newman';
import { Collection, CollectionDefinition } from 'postman-collection';
import qs from 'qs';
import axios, { AxiosResponse } from 'axios';
import { create as parseXML } from 'xmlbuilder2';
import dotenv from 'dotenv';

import communitiesCollection from '../postman/collections/Communities.json';
import peopleCollection from '../postman/collections/People.json';

const PeopleCollection: CollectionDefinition = communitiesCollection as CollectionDefinition;
const CommunitiesCollection: CollectionDefinition = peopleCollection as CollectionDefinition;

dotenv.config();

interface CondensedSummary {
	collection: {
		name: string;
		id: string;
	};
	run: {
		stats: {
			requests: newman.NewmanRunStat;
			assertions: newman.NewmanRunStat;
		};
		failures: {
			parent: {
				name: string;
				id: string;
			},
			source: {
				name: string;
				id: string;
			},
			error: {
				message: string;
				test: string;
			}
		}[];
	};
}

const USERNAME: string = process.env.PN_MIIVERSE_API_TESTING_USERNAME?.trim() || '';
const PASSWORD: string = process.env.PN_MIIVERSE_API_TESTING_PASSWORD?.trim() || '';

if (!USERNAME) {
	throw new Error('PNID username missing. Required for requesting service tokens. Set PN_MIIVERSE_API_TESTING_USERNAME');
}

if (!PASSWORD) {
	throw new Error('PNID password missing. Required for requesting service tokens. Set PN_MIIVERSE_API_TESTING_PASSWORD');
}

const BASE_URL: string = 'https://account.pretendo.cc';
const API_URL: string = `${BASE_URL}/v1/api`;
const MAPPED_IDS_URL: string = `${API_URL}/admin/mapped_ids`;
const ACCESS_TOKEN_URL: string = `${API_URL}/oauth20/access_token/generate`;
const SERVICE_TOKEN_URL: string = `${API_URL}/provider/service_token/@me`;

const DEFAULT_HEADERS: Record<string, string> = {
	'X-Nintendo-Client-ID': 'a2efa818a34fa16b8afbc8a74eba3eda',
	'X-Nintendo-Client-Secret': 'c91cdb5658bd4954ade78533a339cf9a'
};

export function nintendoPasswordHash(password: string, pid: number): string {
	const pidBuffer: Buffer = Buffer.alloc(4);
	pidBuffer.writeUInt32LE(pid);

	const unpacked: Buffer = Buffer.concat([
		pidBuffer,
		Buffer.from('\x02\x65\x43\x46'),
		Buffer.from(password)
	]);

	return crypto.createHash('sha256').update(unpacked).digest().toString('hex');
}

async function apiGetRequest(url: string, headers = {}): Promise<Record<string, any>> {
	const response: AxiosResponse<any, any> = await axios.get(url, {
		headers: Object.assign(headers, DEFAULT_HEADERS),
		validateStatus: () => true
	});

	const data: Record<string, any> = parseXML(response.data).end({ format: 'object' });

	if (data.errors) {
		throw new Error(data.errors.error.message);
	}

	if (data.error) {
		throw new Error(data.error.message);
	}

	return data;
}

async function apiPostRequest(url: string, body: string): Promise<Record<string, any>> {
	const response: AxiosResponse<any, any> = await axios.post(url, body, {
		headers: DEFAULT_HEADERS,
		validateStatus: () => true,
	});

	const data: Record<string, any> = parseXML(response.data).end({ format: 'object' });

	if (data.errors) {
		throw new Error(data.errors.error.message);
	}

	if (data.error) {
		throw new Error(data.error.message);
	}

	return data;
}

async function getPID(username: string): Promise<number> {
	const response: Record<string, any> = await apiGetRequest(`${MAPPED_IDS_URL}?input_type=user_id&output_type=pid&input=${username}`);

	return Number(response.mapped_ids.mapped_id.out_id);
}

async function getAccessToken(username: string, passwordHash: string): Promise<string> {
	const data: string = qs.stringify({
		grant_type: 'password',
		user_id: username,
		password: passwordHash,
		password_type: 'hash',
	});

	const response: Record<string, any> = await apiPostRequest(ACCESS_TOKEN_URL, data);

	return response.OAuth20.access_token.token;
}

async function getMiiverseServiceToken(accessToken: string): Promise<string> {
	const response: Record<string, any> = await apiGetRequest(SERVICE_TOKEN_URL, {
		'X-Nintendo-Title-ID': '0005001010040100',
		Authorization: `Bearer ${accessToken}`
	});

	return response.service_token.token;
}

function runNewmanTest(collection: string | Collection | CollectionDefinition, variables: Record<string, string>): Promise<CondensedSummary> {
	return new Promise((resolve, reject) => {
		newman.run({
			collection: collection,
			reporters: ['cli', 'json'],
			envVar: Object.entries(variables).map(entry => ({ key: entry[0], value: entry[1] }))
		}, (error, summary) => {
			if (error) {
				reject(error);
			} else {
				resolve(createCondensedSummary(summary));
			}
		});
	});
}

function communitiesRoutesTest(serviceToken: string): Promise<CondensedSummary> {
	// TODO - Make this more dynamic?
	return runNewmanTest(CommunitiesCollection, {
		DOMAIN: 'api.olv.pretendo.cc',
		ServiceToken: serviceToken,
		// TODO - Change this name. Should not be game-specific
		PP_Splatoon: 'XHRpdGxlX2lkXDE0MDczNzUxNTM1MjI5NDRcYWNjZXNzX2tleVwwXHBsYXRmb3JtX2lkXDFccmVnaW9uX2lkXDJcbGFuZ3VhZ2VfaWRcMVxjb3VudHJ5X2lkXDExMFxhcmVhX2lkXDBcbmV0d29ya19yZXN0cmljdGlvblwwXGZyaWVuZF9yZXN0cmljdGlvblwwXHJhdGluZ19yZXN0cmljdGlvblwyMFxyYXRpbmdfb3JnYW5pemF0aW9uXDBcdHJhbnNmZXJhYmxlX2lkXDEyNzU2MTQ0ODg0NDUzODk4NzgyXHR6X25hbWVcQW1lcmljYS9OZXdfWW9ya1x1dGNfb2Zmc2V0XC0xNDQwMFxyZW1hc3Rlcl92ZXJzaW9uXDBc',
		// TODO - Change this name. Should not be game-specific
		PP_MarioVsDK: 'XHRpdGxlX2lkXDE0MDczNzUxNTMzMzcwODhcYWNjZXNzX2tleVw2OTI0NzQ1MTBccGxhdGZvcm1faWRcMVxyZWdpb25faWRcMlxsYW5ndWFnZV9pZFwxXGNvdW50cnlfaWRcNDlcYXJlYV9pZFwwXG5ldHdvcmtfcmVzdHJpY3Rpb25cMFxmcmllbmRfcmVzdHJpY3Rpb25cMFxyYXRpbmdfcmVzdHJpY3Rpb25cMTdccmF0aW5nX29yZ2FuaXphdGlvblwxXHRyYW5zZmVyYWJsZV9pZFw3NjA4MjAyOTE2MDc1ODg0NDI1XHR6X25hbWVcUGFjaWZpYy9NaWR3YXlcdXRjX29mZnNldFwtMzk2MDBc',
		PP_Bad_TID: '000',
		'PP_Bad Format': 'XHR'
	});
}

function peopleRoutesTest(serviceToken: string): Promise<CondensedSummary> {
	// TODO - Make this more dynamic?
	return runNewmanTest(PeopleCollection, {
		DOMAIN: 'api.olv.pretendo.cc',
		ServiceToken: serviceToken,
		// TODO - Change this name. Should not be game-specific
		PP_Splatoon: 'XHRpdGxlX2lkXDE0MDczNzUxNTM1MjI5NDRcYWNjZXNzX2tleVwwXHBsYXRmb3JtX2lkXDFccmVnaW9uX2lkXDJcbGFuZ3VhZ2VfaWRcMVxjb3VudHJ5X2lkXDExMFxhcmVhX2lkXDBcbmV0d29ya19yZXN0cmljdGlvblwwXGZyaWVuZF9yZXN0cmljdGlvblwwXHJhdGluZ19yZXN0cmljdGlvblwyMFxyYXRpbmdfb3JnYW5pemF0aW9uXDBcdHJhbnNmZXJhYmxlX2lkXDEyNzU2MTQ0ODg0NDUzODk4NzgyXHR6X25hbWVcQW1lcmljYS9OZXdfWW9ya1x1dGNfb2Zmc2V0XC0xNDQwMFxyZW1hc3Rlcl92ZXJzaW9uXDBc',
	});
}

async function main(): Promise<void> {
	const pid: number = await getPID(USERNAME);
	const passwordHash: string = nintendoPasswordHash(PASSWORD, pid);
	const accessToken: string = await getAccessToken(USERNAME, passwordHash);
	const serviceToken: string = await getMiiverseServiceToken(accessToken);

	await communitiesRoutesTest(serviceToken);
	await peopleRoutesTest(serviceToken);
}

main();

function createCondensedSummary(summary: newman.NewmanRunSummary): CondensedSummary {
	return {
		collection: {
			name: summary.collection.name,
			id: summary.collection.id
		},
		run: {
			stats: {
				requests : summary.run.stats.requests,
				assertions : summary.run.stats.assertions
			},
			failures: summary.run.failures.map((failure: newman.NewmanRunFailure) => ({
				parent: {
					name: failure.parent.name,
					id : failure.parent.id
				},
				source: {
					name: failure.source?.name || 'Unknown',
					id : failure.source?.id || 'Unknown'
				},
				error: {
					message: failure.error.message,
					test : failure.error.test
				}
			}))
		}
	};
}