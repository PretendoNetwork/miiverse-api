import mongoose from 'mongoose';
import { LOG_INFO, LOG_ERROR } from '@/logger';
import { config } from '@/config-manager';

const { account_db: mongooseConfig } = config;

export let pnidConnection: mongoose.Connection;

export function connect() {
    if(!pnidConnection)
        pnidConnection = makeNewConnection(mongooseConfig.connection_string);
}

export function verifyConnected() {
    if (!pnidConnection) {
        throw new Error('Cannot make database requests without being connected');
    }
}

export function makeNewConnection(uri) {
    pnidConnection = mongoose.createConnection(uri, mongooseConfig.options);

    pnidConnection.on('error', function (error) {
        LOG_ERROR(`MongoDB connection ${this.name} ${JSON.stringify(error)}`);
        pnidConnection.close().catch(() =>LOG_ERROR(`MongoDB failed to close connection ${this.name}`));
    });

    pnidConnection.on('connected', function () {
        LOG_INFO(`MongoDB connected ${this.name} / ${uri}`);
    });

    pnidConnection.on('disconnected', function () {
        LOG_INFO(`MongoDB disconnected ${this.name}`);
    });

    return pnidConnection;
}

pnidConnection = makeNewConnection(mongooseConfig.connection_string);
