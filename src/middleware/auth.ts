import express from 'express';
import xmlbuilder from 'xmlbuilder';
import { z } from 'zod';
import { getPNID, getEndpoint } from '@/database';
import { getValueFromHeaders, decodeParamPack, getPIDFromServiceToken } from '@/util';
import { ParamPack } from '@/types/common/param-pack';
import { HydratedEndpointDocument } from '@/types/mongoose/endpoint';
import { HydratedPNIDDocument } from '@/types/mongoose/pnid';

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

	let token: string | undefined = getValueFromHeaders(request.headers, 'x-nintendo-servicetoken');
	if (!token) {
		token = getValueFromHeaders(request.headers, 'olive service token');
	}

	if (!token) {
		return badAuth(response, 15, 'NO_TOKEN');
	}

	const paramPack: string | undefined = getValueFromHeaders(request.headers, 'x-nintendo-parampack');
	if (!paramPack) {
		return badAuth(response, 17, 'NO_PARAM');
	}

	const paramPackData: ParamPack = decodeParamPack(paramPack);
	const paramPackCheck: z.SafeParseReturnType<ParamPack, ParamPack> = ParamPackSchema.safeParse(paramPackData);
	if (!paramPackCheck.success) {
		return badAuth(response, 18, 'BAD_PARAM');
	}

	const pid: number = getPIDFromServiceToken(token);

	if (pid === 0) {
		return badAuth(response, 16, 'BAD_TOKEN');
	}

	const user: HydratedPNIDDocument | null = await getPNID(pid);
	let discovery: HydratedEndpointDocument | null;
	if (user) {
		discovery = await getEndpoint(user.server_access_level);
	} else {
		discovery = await getEndpoint('prod');
	}

	if (!discovery) {
		return badAuth(response, 19, 'NO_DISCOVERY');
	}

	if (discovery.status !== 0) {
		return serverError(response, discovery);
	}

	request.pid = pid;
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
	let message: string = '';
	let error: number = 0;

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
