import { Model, HydratedDocument } from 'mongoose';

enum ACCESS_LEVEL {
	Banned = -1,
	Standard = 0,
	Tester = 1,
	Mod = 2,
	Developer = 3
}

type SERVER_ACCESS_LEVEL = 'prod' | 'test' | 'dev';

export interface IPNID {
	access_level: ACCESS_LEVEL;
	server_access_level: SERVER_ACCESS_LEVEL;
	pid: number;
	username: string;
	birthdate: string;
	country: string;
	mii: {
		name: string;
		data: string;
	};
	connections: {
		stripe: {
			customer_id: string;
			subscription_id: string;
			price_id: string;
			tier_level: number;
			tier_name: string;
			latest_webhook_timestamp: number;
		};
	};
}

export interface IPNIDMethods {}

interface IPNIDQueryHelpers {}

export interface PNIDModel extends Model<IPNID, IPNIDQueryHelpers, IPNIDMethods> {}

export type HydratedPNIDDocument = HydratedDocument<IPNID, IPNIDMethods>