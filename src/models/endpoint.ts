import { Schema, model } from 'mongoose';
import { IEndpoint, IEndpointMethods, EndpointModel } from '@/types/mongoose/endpoint';

const endpointSchema = new Schema<IEndpoint, EndpointModel, IEndpointMethods>({
	status: Number,
	server_access_level: String,
	topics: Boolean,
	guest_access: Boolean,
	host: String,
	api_host: String,
	portal_host: String,
	n3ds_host: String
});

export const Endpoint = model<IEndpoint, EndpointModel>('Endpoint', endpointSchema);
