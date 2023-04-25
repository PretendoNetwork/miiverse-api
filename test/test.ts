/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from 'node:crypto';
import newman from 'newman';
import { Collection, CollectionDefinition } from 'postman-collection';
import qs from 'qs';
import axios, { AxiosResponse } from 'axios';
import { create as parseXML } from 'xmlbuilder2';
import { table } from 'table';
import ora from 'ora';
import dotenv from 'dotenv';
import colors from 'colors';

import communitiesCollection from '../postman/collections/Communities.json';
import peopleCollection from '../postman/collections/People.json';

const PeopleCollection: CollectionDefinition = peopleCollection as CollectionDefinition;
const CommunitiesCollection: CollectionDefinition = communitiesCollection as CollectionDefinition;

dotenv.config();
colors.enable();

interface TestResult {
	collection: string;
	name: string;
	url: string;
	query: string;
	assertion: string;
	error?: string
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

function runNewmanTest(collection: string | Collection | CollectionDefinition, variables: Record<string, string>): Promise<TestResult[]> {
	return new Promise((resolve, reject) => {
		newman.run({
			collection: collection,
			reporters: ['json'],
			envVar: Object.entries(variables).map(entry => ({ key: entry[0], value: entry[1] })),
			globals: variables,
			globalVar: Object.entries(variables).map(entry => ({ key: entry[0], value: entry[1] })),
		}, (error, summary) => {
			if (error) {
				reject(error);
			} else {
				resolve(createTestResults(summary));
			}
		});
	});
}

function communitiesRoutesTest(serviceToken: string): Promise<TestResult[]> {
	// TODO - Make this more dynamic?
	return runNewmanTest(CommunitiesCollection, {
		DOMAIN: 'api.olv.pretendo.cc',
		ServiceToken: serviceToken,
		// TODO - Change these names. Should not be game-specific
		PP_Splatoon: 'XHRpdGxlX2lkXDE0MDczNzUxNTM1MjI5NDRcYWNjZXNzX2tleVwwXHBsYXRmb3JtX2lkXDFccmVnaW9uX2lkXDJcbGFuZ3VhZ2VfaWRcMVxjb3VudHJ5X2lkXDExMFxhcmVhX2lkXDBcbmV0d29ya19yZXN0cmljdGlvblwwXGZyaWVuZF9yZXN0cmljdGlvblwwXHJhdGluZ19yZXN0cmljdGlvblwyMFxyYXRpbmdfb3JnYW5pemF0aW9uXDBcdHJhbnNmZXJhYmxlX2lkXDEyNzU2MTQ0ODg0NDUzODk4NzgyXHR6X25hbWVcQW1lcmljYS9OZXdfWW9ya1x1dGNfb2Zmc2V0XC0xNDQwMFxyZW1hc3Rlcl92ZXJzaW9uXDBc',
		PP_MarioVsDK: 'XHRpdGxlX2lkXDE0MDczNzUxNTMzMzcwODhcYWNjZXNzX2tleVw2OTI0NzQ1MTBccGxhdGZvcm1faWRcMVxyZWdpb25faWRcMlxsYW5ndWFnZV9pZFwxXGNvdW50cnlfaWRcNDlcYXJlYV9pZFwwXG5ldHdvcmtfcmVzdHJpY3Rpb25cMFxmcmllbmRfcmVzdHJpY3Rpb25cMFxyYXRpbmdfcmVzdHJpY3Rpb25cMTdccmF0aW5nX29yZ2FuaXphdGlvblwxXHRyYW5zZmVyYWJsZV9pZFw3NjA4MjAyOTE2MDc1ODg0NDI1XHR6X25hbWVcUGFjaWZpYy9NaWR3YXlcdXRjX29mZnNldFwtMzk2MDBc',
		PP_Bad_TID: 'XHRpdGxlX2lkXDEyMzRcYWNjZXNzX2tleVwwXHBsYXRmb3JtX2lkXDFccmVnaW9uX2lkXDJcbGFuZ3VhZ2VfaWRcMVxjb3VudHJ5X2lkXDExMFxhcmVhX2lkXDBcbmV0d29ya19yZXN0cmljdGlvblwwXGZyaWVuZF9yZXN0cmljdGlvblwwXHJhdGluZ19yZXN0cmljdGlvblwyMFxyYXRpbmdfb3JnYW5pemF0aW9uXDBcdHJhbnNmZXJhYmxlX2lkXDEyNzU2MTQ0ODg0NDUzODk4NzgyXHR6X25hbWVcQW1lcmljYS9OZXdfWW9ya1x1dGNfb2Zmc2V0XC0xNDQwMFxyZW1hc3Rlcl92ZXJzaW9uXDBc',
		PP_ACPlaza: 'XHRpdGxlX2lkXDE0MDczNzUxNTMzMjE0NzJcYWNjZXNzX2tleVwwXHBsYXRmb3JtX2lkXDFccmVnaW9uX2lkXDJcbGFuZ3VhZ2VfaWRcMVxjb3VudHJ5X2lkXDExMFxhcmVhX2lkXDBcbmV0d29ya19yZXN0cmljdGlvblwwXGZyaWVuZF9yZXN0cmljdGlvblwwXHJhdGluZ19yZXN0cmljdGlvblwyMFxyYXRpbmdfb3JnYW5pemF0aW9uXDBcdHJhbnNmZXJhYmxlX2lkXDEyNzU2MTQ0ODg0NDUzODk4NzgyXHR6X25hbWVcQW1lcmljYS9OZXdfWW9ya1x1dGNfb2Zmc2V0XC0xNDQwMFxyZW1hc3Rlcl92ZXJzaW9uXDBc',
		'PP_Bad Format': 'XHR'
	});
}

function peopleRoutesTest(serviceToken: string): Promise<TestResult[]> {
	// TODO - Make this more dynamic?
	return runNewmanTest(PeopleCollection, {
		DOMAIN: 'api.olv.pretendo.cc',
		ServiceToken: serviceToken,
		// TODO - Change this name. Should not be game-specific
		PP_Splatoon: 'XHRpdGxlX2lkXDE0MDczNzUxNTM1MjI5NDRcYWNjZXNzX2tleVwwXHBsYXRmb3JtX2lkXDFccmVnaW9uX2lkXDJcbGFuZ3VhZ2VfaWRcMVxjb3VudHJ5X2lkXDExMFxhcmVhX2lkXDBcbmV0d29ya19yZXN0cmljdGlvblwwXGZyaWVuZF9yZXN0cmljdGlvblwwXHJhdGluZ19yZXN0cmljdGlvblwyMFxyYXRpbmdfb3JnYW5pemF0aW9uXDBcdHJhbnNmZXJhYmxlX2lkXDEyNzU2MTQ0ODg0NDUzODk4NzgyXHR6X25hbWVcQW1lcmljYS9OZXdfWW9ya1x1dGNfb2Zmc2V0XC0xNDQwMFxyZW1hc3Rlcl92ZXJzaW9uXDBc',
	});
}

async function main(): Promise<void> {
	const tokensSpinner = ora('Acquiring account tokens').start();

	const pid: number = await getPID(USERNAME);
	const passwordHash: string = nintendoPasswordHash(PASSWORD, pid);
	const accessToken: string = await getAccessToken(USERNAME, passwordHash);
	const serviceToken: string = await getMiiverseServiceToken(accessToken);

	tokensSpinner.succeed();

	const testsSpinner = ora('Running tests').start();

	const results: TestResult[] = [
		...await communitiesRoutesTest(serviceToken),
		...await peopleRoutesTest(serviceToken)
	];

	const passed = results.filter(result => !result.error);
	const failed = results.filter(result => result.error);

	if (failed.length !== 0) {
		testsSpinner.warn('Some tests have failed! See before for details');
	} else {
		testsSpinner.succeed('All tests passed!');
	}

	const testsOverviewData = [
		['Tests Ran'.cyan, results.length.toString().cyan],
		['Passed'.green, passed.length.toString().green]
	];

	if (failed.length === 0) {
		testsOverviewData.push(['Failed'.red, failed.length.toString().green]);
	} else {
		testsOverviewData.push(['Failed'.red, failed.length.toString().red]);
	}

	const config = {
		singleLine: true,
		border: {
			topBody: '─',
			topJoin: '┬',
			topLeft: '┌',
			topRight: '┐',

			bottomBody: '─',
			bottomJoin: '┴',
			bottomLeft: '└',
			bottomRight: '┘',

			bodyLeft: '│',
			bodyRight: '│',
			bodyJoin: '│',

			joinBody: '─',
			joinLeft: '├',
			joinRight: '┤',
			joinJoin: '┼'
		}
	};

	console.log(table(testsOverviewData, config));

	if (failed.length !== 0) {
		console.log('Failed tests:\n'.red.underline.italic.bold);
		for (const test of failed) {
			console.log('Collection:'.bold, test.collection.red.bold);
			console.log('Test Name:'.bold, test.name.red.bold);
			console.log('URL:'.bold, `${test.url}${test.query ? '?' + test.query : ''}`.red.bold);
			console.log('Message:'.bold, test.error?.red.bold);
			console.log('\n');
		}
	}
}

main();

function createTestResults(summary: newman.NewmanRunSummary): TestResult[] {
	const results: TestResult[] = [];

	for (const execution of summary.run.executions) {
		const request = execution.request;
		for (const assertion of execution.assertions) {
			const result: TestResult = {
				collection: summary.collection.name,
				name: execution.item.name,
				url: `${request.url.protocol}://${request.url.host?.join('.')}/${request.url.path?.join('/')}`,
				query: qs.stringify(request.url.query.all().reduce((object: Record<string, string>, item: { disabled?: boolean; key: string | null; value: string | null; }) => {
					if (!item.disabled && item.key && item.value) {
						object[item.key] = item.value;
					}
					return object;
				}, {})),
				assertion: assertion.assertion
			};

			if (assertion.error) {
				result.error = `${assertion.error.name}: ${assertion.error.message}`;
			}

			results.push(result);
		}
	}

	return results;
}