import mongoose from 'mongoose';

export interface Config {
	http: {
		port: number;
	};
	account_server_address: string;
	account_server_secret: string;
	mongoose: {
		connection_string: string;
		options: mongoose.ConnectOptions;
	};
	s3: {
		endpoint: string;
		key: string;
		secret: string;
	};
	grpc: {
		friends: {
			ip: string;
			port: number;
			api_key: string;
		};
		account: {
			ip: string;
			port: number;
			api_key: string;
		};
	};
}