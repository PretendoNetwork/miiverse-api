import express from 'express';
import xmlbuilder from 'xmlbuilder';
import { getValueFromQueryString } from '@/util';

const router = express.Router();

router.get('/:pid/notifications', function(request: express.Request, response: express.Response): void {
	const type = getValueFromQueryString(request.query, 'type')[0];
	const titleID = getValueFromQueryString(request.query, 'title_id')[0];
	const pid = getValueFromQueryString(request.query, 'pid')[0];

	console.log(type);
	console.log(titleID);
	console.log(pid);

	response.type('application/xml');
	response.send(xmlbuilder.create({
		result: {
			has_error: 0,
			version: 1,
			posts: ' '
		}
	}).end({ pretty: true }));
});

export default router;
