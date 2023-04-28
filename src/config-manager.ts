import fs from 'fs-extra';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LOG_INFO, LOG_WARN, LOG_ERROR } from '@/logger';
import { Config } from '@/types/common/config';

dotenv.config();

LOG_INFO('Loading config');

let mongooseConnectOptionsMain: mongoose.ConnectOptions = {};

if (process.env.PN_MIIVERSE_API_CONFIG_MONGOOSE_CONNECT_OPTIONS_PATH) {
	mongooseConnectOptionsMain = fs.readJSONSync(process.env.PN_MIIVERSE_API_CONFIG_MONGOOSE_CONNECT_OPTIONS_PATH);
} else {
	LOG_WARN('No Mongoose connection options found for main connection. To add connection options, set PN_MIIVERSE_API_CONFIG_MONGOOSE_CONNECT_OPTIONS_PATH to the path of your options JSON file');
}

export const config: Config = {
	http: {
		port: Number(process.env.PN_MIIVERSE_API_CONFIG_HTTP_PORT || '')
	},
	account_server_address: process.env.PN_MIIVERSE_API_CONFIG_ACCOUNT_SERVER_ADDRESS || '',
	account_server_secret: process.env.PN_MIIVERSE_API_CONFIG_ACCOUNT_SERVER_SECRET || '',
	mongoose: {
		connection_string: process.env.PN_MIIVERSE_API_CONFIG_MONGO_CONNECTION_STRING || '',
		options: mongooseConnectOptionsMain
	},
	s3: {
		endpoint: process.env.PN_MIIVERSE_API_CONFIG_S3_ENDPOINT || '',
		key: process.env.PN_MIIVERSE_API_CONFIG_S3_ACCESS_KEY || '',
		secret: process.env.PN_MIIVERSE_API_CONFIG_S3_ACCESS_SECRET || ''
	},
	grpc: {
		friends: {
			ip: process.env.PN_MIIVERSE_API_CONFIG_GRPC_FRIENDS_IP || '',
			port: Number(process.env.PN_MIIVERSE_API_CONFIG_GRPC_FRIENDS_PORT || ''),
			api_key: process.env.PN_MIIVERSE_API_CONFIG_GRPC_FRIENDS_API_KEY || ''
		},
		account: {
			ip: process.env.PN_MIIVERSE_API_CONFIG_GRPC_ACCOUNT_IP || '',
			port: Number(process.env.PN_MIIVERSE_API_CONFIG_GRPC_ACCOUNT_PORT || ''),
			api_key: process.env.PN_MIIVERSE_API_CONFIG_GRPC_ACCOUNT_API_KEY || ''
		}
	}
};

LOG_INFO('Config loaded, checking integrity');

if (!config.http.port) {
	LOG_ERROR('Failed to find HTTP port. Set the PN_MIIVERSE_API_CONFIG_HTTP_PORT environment variable');
	process.exit(0);
}

if (!config.account_server_address) {
	LOG_ERROR('Failed to find account server address. Set the PN_MIIVERSE_API_CONFIG_ACCOUNT_SERVER_ADDRESS environment variable');
	process.exit(0);
}

if (!config.account_server_secret) {
	LOG_ERROR('Failed to find account server secret. Set the PN_MIIVERSE_API_CONFIG_ACCOUNT_SERVER_SECRET environment variable');
	process.exit(0);
}

if (!config.mongoose.connection_string) {
	LOG_ERROR('Failed to find MongoDB connection string. Set the PN_MIIVERSE_API_CONFIG_MONGO_CONNECTION_STRING environment variable');
	process.exit(0);
}

if (!config.s3.endpoint) {
	LOG_ERROR('Failed to find s3 endpoint. Set the PN_MIIVERSE_API_CONFIG_S3_ENDPOINT environment variable');
	process.exit(0);
}

if (!config.s3.key) {
	LOG_ERROR('Failed to find s3 key. Set the PN_MIIVERSE_API_CONFIG_S3_ACCESS_KEY environment variable');
	process.exit(0);
}

if (!config.s3.secret) {
	LOG_ERROR('Failed to find s3 secret. Set the PN_MIIVERSE_API_CONFIG_S3_ACCESS_SECRET environment variable');
	process.exit(0);
}

if (!config.grpc.friends.ip) {
	LOG_ERROR('Failed to find NEX Friends gRPC ip. Set the PN_MIIVERSE_API_CONFIG_GRPC_FRIENDS_IP environment variable');
	process.exit(0);
}

if (!config.grpc.friends.port) {
	LOG_ERROR('Failed to find NEX Friends gRPC port. Set the PN_MIIVERSE_API_CONFIG_GRPC_FRIENDS_PORT environment variable');
	process.exit(0);
}

if (!config.grpc.friends.api_key) {
	LOG_ERROR('Failed to find NEX Friends gRPC API key. Set the PN_MIIVERSE_API_CONFIG_GRPC_FRIENDS_API_KEY environment variable');
	process.exit(0);
}

if (!config.grpc.account.ip) {
	LOG_ERROR('Failed to find account server gRPC ip. Set the PN_MIIVERSE_API_CONFIG_GRPC_ACCOUNT_IP environment variable');
	process.exit(0);
}

if (!config.grpc.account.port) {
	LOG_ERROR('Failed to find account server gRPC port. Set the PN_MIIVERSE_API_CONFIG_GRPC_ACCOUNT_PORT environment variable');
	process.exit(0);
}

if (!config.grpc.account.api_key) {
	LOG_ERROR('Failed to find account server gRPC API key. Set the PN_MIIVERSE_API_CONFIG_GRPC_ACCOUNT_API_KEY environment variable');
	process.exit(0);
}