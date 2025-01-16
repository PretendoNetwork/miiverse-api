import express from 'express';
import xmlbuilder from 'xmlbuilder';
import { getUserAccountData } from '@/util';
import { getEndpoint } from '@/database';
import type { GetUserDataResponse } from '@pretendonetwork/grpc/account/get_user_data_rpc';
import type { HydratedEndpointDocument } from '@/types/mongoose/endpoint';

const router = express.Router();

/* GET discovery server. */
router.get('/', async function (request: express.Request, response: express.Response): Promise<void> {
	response.type('application/xml');

	let user: GetUserDataResponse;

	try {
		user = await getUserAccountData(request.pid);
	} catch (ignored) {
		// TODO - Log this error
		response.sendStatus(404);
		return;
	}

	let discovery: HydratedEndpointDocument | null;

	if (user) {
		discovery = await getEndpoint(user.serverAccessLevel);
	} else {
		discovery = await getEndpoint('prod');
	}

	// TODO - Better error
	if (!discovery) {
		response.sendStatus(404);
		return;
	}

	let message = '';
	let errorCode = 0;
	switch (discovery.status) {
		case 0:
			response.send(xmlbuilder.create({
				result: {
					has_error: 0,
					version: 1,
					endpoint: {
						host: discovery.host,
						api_host: discovery.api_host,
						portal_host: discovery.portal_host,
						n3ds_host: discovery.n3ds_host
					}
				}
			}).end({ pretty: true }));

			return;
		case 1:
			message = 'SYSTEM_UPDATE_REQUIRED';
			errorCode = 1;
			break;
		case 2:
			message = 'SETUP_NOT_COMPLETE';
			errorCode = 2;
			break;
		case 3:
			message = 'SERVICE_MAINTENANCE';
			errorCode = 3;
			break;
		case 4:
			message = 'SERVICE_CLOSED';
			errorCode = 4;
			break;
		case 5:
			message = 'PARENTAL_CONTROLS_ENABLED';
			errorCode = 5;
			break;
		case 6:
			message = 'POSTING_LIMITED_PARENTAL_CONTROLS';
			errorCode = 6;
			break;
		case 7:
			message = 'NNID_BANNED';
			errorCode = 7;
			response.type('application/xml');
			break;
		default:
			message = 'SERVER_ERROR';
			errorCode = 15;
			response.type('application/xml');
			break;
	}

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
});

export default router;
