import { Model, HydratedDocument } from 'mongoose';

export interface IEndpoint {
	status: number;
    server_access_level: string;
    topics: boolean;
    guest_access: boolean;
    host: string;
    api_host: string;
    portal_host: string;
    n3ds_host: string;
}

export interface IEndpointMethods {}

interface IEndpointQueryHelpers {}

export interface EndpointModel extends Model<IEndpoint, IEndpointQueryHelpers, IEndpointMethods> {}

export type HydratedEndpointDocument = HydratedDocument<IEndpoint, IEndpointMethods>