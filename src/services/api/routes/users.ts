import express from 'express';
import xml from 'object-to-xml';
import { getValueFromQueryString } from '@/util';

const router: express.Router = express.Router();

router.get('/:pid/notifications', function(request: express.Request, response: express.Response): void {
	const type: string | undefined = getValueFromQueryString(request.query, 'type');
	const titleID: string | undefined = getValueFromQueryString(request.query, 'title_id');
	const pid: string | undefined = getValueFromQueryString(request.query, 'pid');

	console.log(type);
	console.log(titleID);
	console.log(pid);

	response.type('application/xml');
	response.send('<?xml version="1.0" encoding="UTF-8"?>\n' + xml({
		result: {
			has_error: 0,
			version: 1,
			posts: ' '
		}
	}));
});

export default router;
