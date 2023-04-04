process.title = 'Pretendo - Miiverse';
const express = require('express');
const morgan = require('morgan');
const xmlparser = require('./middleware/xml-parser');
const database = require('./database');
const logger = require('./logger');
const config = require('../config.json');
const auth = require('./middleware/auth');

const { http: { port } } = config;
const app = express();

const miiverse = require('./services/miiverse-api');
const xml = require("object-to-xml");

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
app.use(auth);

// import the servers into one
app.use(miiverse);

// 404 handler
logger.info('Creating 404 status handler');
app.use((req, res) => {
    //logger.warn(request.protocol + '://' + request.get('host') + request.originalUrl);
    res.set("Content-Type", "application/xml");
    res.statusCode = 404;
    let response = {
        result: {
            has_error: 1,
            version: 1,
            code: 404,
            message: "Not Found"
        }
    };
    return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
});

// non-404 error handler
logger.info('Creating non-404 status handler');
app.use((error, req, res) => {
    const status = error.status || 500;
    res.set("Content-Type", "application/xml");
    res.statusCode = 404;
    let response = {
        result: {
            has_error: 1,
            version: 1,
            code: status,
            message: "Not Found"
        }
    };
    return res.send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml(response));
});

// Starts the server
logger.info('Starting server');

database.connect().then(() => {
    app.listen(port, () => {
        logger.success(`Server started on port ${port}`);
    });
});