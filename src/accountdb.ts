import mongoose from 'mongoose';
import { LOG_INFO, LOG_ERROR } from '@/logger';
import { config } from '@/config-manager';

const { account_db: mongooseConfig } = config;

export let pnidConnection: mongoose.Connection;

export function connect(): void {
	if (!pnidConnection) {
		pnidConnection = makeNewConnection(mongooseConfig.connection_string);
	}
}

export function verifyConnected(): void {
	if (!pnidConnection) {
		throw new Error('Cannot make database requests without being connected');
	}
}

export function makeNewConnection(uri: string): mongoose.Connection {
	pnidConnection = mongoose.createConnection(uri, mongooseConfig.options);

	pnidConnection.on('error', error => {
		LOG_ERROR(`MongoDB connection ${JSON.stringify(error)}`);
		pnidConnection.close().catch(error => LOG_ERROR(JSON.stringify(error)));
	});

	pnidConnection.on('connected', () => {
		LOG_INFO(`MongoDB connected ${uri}`);
	});

	pnidConnection.on('disconnected', () => {
		LOG_INFO('MongoDB disconnected');
	});

	return pnidConnection;
}

pnidConnection = makeNewConnection(mongooseConfig.connection_string);
