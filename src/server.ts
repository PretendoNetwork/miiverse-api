process.title = 'Pretendo - Miiverse';

import express from 'express';
import morgan from 'morgan';
import xml from 'object-to-xml';
import { connect as connectDatabase } from '@/database';
import { LOG_INFO, LOG_SUCCESS } from '@/logger';
import config from '../config.json';
import xmlparser from '@/middleware/xml-parser';
import auth from '@/middleware/auth';

import miiverse from '@/services/miiverse-api';

const { http: { port } } = config;
const app = express();

app.set('etag', false);
app.disable('x-powered-by');

// Create router
LOG_INFO('Setting up Middleware');
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({
	extended: true,
	limit: '5mb',
	parameterLimit: 100000
}));
app.use(xmlparser);
app.use(auth);

// import the servers into one
app.use(miiverse);

// 404 handler
LOG_INFO('Creating 404 status handler');
app.use((req, res) => {
	//logger.warn(request.protocol + '://' + request.get('host') + request.originalUrl);
	res.set('Content-Type', 'application/xml');
	res.statusCode = 404;
	const response = {
		result: {
			has_error: 1,
			version: 1,
			code: 404,
			message: 'Not Found'
		}
	};
	return res.send('<?xml version="1.0" encoding="UTF-8"?>\n' + xml(response));
});

// non-404 error handler
LOG_INFO('Creating non-404 status handler');
app.use((error, req, res, _next) => {
	const status = error.status || 500;
	res.set('Content-Type', 'application/xml');
	res.statusCode = 404;
	const response = {
		result: {
			has_error: 1,
			version: 1,
			code: status,
			message: 'Not Found'
		}
	};
	return res.send('<?xml version="1.0" encoding="UTF-8"?>\n' + xml(response));
});

// Starts the server
LOG_INFO('Starting server');
connectDatabase().then(() => {
	app.listen(port, () => {
		LOG_SUCCESS(`Server started on port ${port}`);
	});
});