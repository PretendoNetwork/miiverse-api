import express from 'express';
import xmlbuilder from 'xmlbuilder';
import { z } from 'zod';
import { GetUserDataResponse } from '@pretendonetwork/grpc/account/get_user_data_rpc';
import { getEndpoint } from '@/database';
import { getUserAccountData, getValueFromHeaders, decodeParamPack, getPIDFromServiceToken } from '@/util';
import { HydratedEndpointDocument } from '@/types/mongoose/endpoint';

const ParamPackSchema = z.object({
	title_id: z.string(),
	access_key: z.string(),
	platform_id: z.string(),
	region_id: z.string(),
	language_id: z.string(),
	country_id: z.string(),
	area_id: z.string(),
	network_restriction: z.string(),
	friend_restriction: z.string(),
	rating_restriction: z.string(),
	rating_organization: z.string(),
	transferable_id: z.string(),
	tz_name: z.string(),
	utc_offset: z.string(),
	remaster_version: z.string().optional()
});

async function auth(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
	if (request.path.includes('/v1/status')) {
		return next();
	}

	// * Just don't care about the token here
	if (request.path === '/v1/topics') {
		return next();
	}

	let encryptedToken = getValueFromHeaders(request.headers, 'x-nintendo-servicetoken');
	if (!encryptedToken) {
		encryptedToken = getValueFromHeaders(request.headers, 'olive service token');
	}

	if (!encryptedToken) {
		return badAuth(response, 15, 'NO_TOKEN');
	}

	const pid: number = getPIDFromServiceToken(encryptedToken);
	if (pid === 0) {
		return badAuth(response, 16, 'BAD_TOKEN');
	}

	const paramPack = getValueFromHeaders(request.headers, 'x-nintendo-parampack');
	if (!paramPack) {
		return badAuth(response, 17, 'NO_PARAM');
	}

	const paramPackData = decodeParamPack(paramPack);
	const paramPackCheck = ParamPackSchema.safeParse(paramPackData);
	if (!paramPackCheck.success) {
		console.log(paramPackCheck.error);
		return badAuth(response, 18, 'BAD_PARAM');
	}

	let user: GetUserDataResponse;

	try {
		user = await getUserAccountData(pid);
	} catch (error) {
		// TODO - Log this error
		console.log(error);
		return badAuth(response, 18, 'BAD_PARAM');
	}

	let discovery: HydratedEndpointDocument | null;

	if (user) {
		discovery = await getEndpoint(user.serverAccessLevel);
	} else {
		discovery = await getEndpoint('prod');
	}

	if (!discovery) {
		return badAuth(response, 19, 'NO_DISCOVERY');
	}

	if (discovery.status !== 0) {
		return serverError(response, discovery);
	}

	// * This is a false positive from ESLint.
	// * Since this middleware is only ever called
	// * per every request instance
	// eslint-disable-next-line require-atomic-updates
	request.pid = pid;
	// eslint-disable-next-line require-atomic-updates
	request.paramPack = paramPackData;

	return next();
}

function badAuth(response: express.Response, errorCode: number, message: string): void {
	response.type('application/xml');
	response.status(400);

	response.send(xmlbuilder.create({
		result: {
			has_error: 1,
			version: 1,
			code: 400,
			error_code: errorCode,
			message: message
		}
	}).end({ pretty: true }));
}

function serverError(response: express.Response, discovery: HydratedEndpointDocument): void {
	let message = '';
	let error = 0;

	switch (discovery.status) {
		case 1 :
			message = 'SYSTEM_UPDATE_REQUIRED';
			error = 1;
			break;
		case 2 :
			message = 'SETUP_NOT_COMPLETE';
			error = 2;
			break;
		case 3 :
			message = 'SERVICE_MAINTENANCE';
			error = 3;
			break;
		case 4:
			message = 'SERVICE_CLOSED';
			error = 4;
			break;
		case 5 :
			message = 'PARENTAL_CONTROLS_ENABLED';
			error = 5;
			break;
		case 6 :
			message = 'POSTING_LIMITED_PARENTAL_CONTROLS';
			error = 6;
			break;
		case 7 :
			message = 'NNID_BANNED';
			error = 7;
			break;
		default :
			message = 'SERVER_ERROR';
			error = 15;
			break;
	}

	response.type('application/xml');
	response.status(400);

	response.send(xmlbuilder.create({
		result: {
			has_error: 1,
			version: 1,
			code: 400,
			error_code: error,
			message: message
		}
	}).end({ pretty: true }));
}

export default auth;
