import mongoose from 'mongoose';
import { pnidConnection } from '@/accountdb';
import { IPNID, IPNIDMethods, PNIDModel } from '@/types/mongoose/pnid';

const PNIDSchema = new mongoose.Schema<IPNID, PNIDModel, IPNIDMethods>({
	access_level: {
		type: Number,
		default: 0  // -1: banned, 0: standard, 1: tester, 2: mod, 3: dev
	},
	server_access_level: {
		type: String,
		default: 'prod' // prod, test, dev
	},
	pid: {
		type: Number,
		unique: true
	},
	username: String,
	birthdate: String,
	country: String,
	mii: {
		name: String,
		data: String,
	},
	connections: {
		stripe: {
			customer_id: String,
			subscription_id: String,
			price_id: String,
			tier_level: Number,
			tier_name: String,
			latest_webhook_timestamp: Number
		}
	}
});

export const PNID: PNIDModel = pnidConnection.model<IPNID, PNIDModel>('PNID', PNIDSchema);

