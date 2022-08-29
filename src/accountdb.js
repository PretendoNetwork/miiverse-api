const mongoose = require('mongoose');
const { account_db: mongooseConfig } = require('../config.json');
const { uri, database, options } = mongooseConfig;
const logger = require('./logger');

let pnidConnection;

function connect() {
    if(!pnidConnection)
        pnidConnection = makeNewConnection(`${uri}/${database}`, options);
}

function verifyConnected() {
    if (!pnidConnection) {
        throw new Error('Cannot make database requests without being connected');
    }
}

function makeNewConnection(uri) {
    pnidConnection = mongoose.createConnection(uri, options);

    pnidConnection.on('error', function (error) {
        logger.error(`MongoDB connection ${this.name} ${JSON.stringify(error)}`);
        pnidConnection.close().catch(() => logger.error(`MongoDB failed to close connection ${this.name}`));
    });

    pnidConnection.on('connected', function () {
        logger.info(`MongoDB connected ${this.name} / ${uri}`);
    });

    pnidConnection.on('disconnected', function () {
        logger.info(`MongoDB disconnected ${this.name}`);
    });

    return pnidConnection;
}

pnidConnection = makeNewConnection(`${uri}/${database}`, options);

module.exports = {
    pnidConnection,
    connect,
    verifyConnected
};
