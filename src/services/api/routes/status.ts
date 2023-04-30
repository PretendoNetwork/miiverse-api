import express from 'express';
import { getEndpoints } from '@/database';
import { HydratedEndpointDocument } from '@/types/mongoose/endpoint';

const router: express.Router = express.Router();

router.get('/', function(_request: express.Request, response: express.Response): void {
	response.send('Pong!');
});

router.get('/database', async function(_request: express.Request, response: express.Response): Promise<void> {
	const endpoints: HydratedEndpointDocument[] = await getEndpoints();

	if (endpoints && endpoints.length <= 0) {
		response.send('DB Connection Working! :D');
	} else {
		response.send('DB Connection Not Working! D:');
	}
});

export default router;
