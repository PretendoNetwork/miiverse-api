process.title = 'Pretendo - Miiverse';
const express = require('express');
const morgan = require('morgan');
const xmlparser = require('./middleware/xml-parser');
const database = require('./database');
const logger = require('./logger');
const config = require('../config.json');

const { http: { port } } = config;
const app = express();

const miiverse = require('./services/miiverse-api');

app.set('etag', false);
app.disable('x-powered-by');

// Create router
logger.info('Setting up Middleware');
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({
    extended: true,
    limit: '5mb',
    parameterLimit: 100000
}));
app.use(xmlparser);

// import the servers into one
app.use(miiverse);

// 404 handler
logger.info('Creating 404 status handler');
app.use((request, response) => {
    //logger.warn(request.protocol + '://' + request.get('host') + request.originalUrl);
    response.status(404);
    response.send();
});

// non-404 error handler
logger.info('Creating non-404 status handler');
app.use((error, request, response) => {
    const status = error.status || 500;

    response.status(status);

    response.json({
        app: 'api',
        status,
        error: error.message
    });
});

// Starts the server
logger.info('Starting server');

database.connect().then(() => {
    app.listen(port, () => {
        logger.success(`Server started on port ${port}`);
    });
});