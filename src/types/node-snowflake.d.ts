declare module 'node-snowflake' {
	export interface SnowflakeInitConfig {
		worker_id: number;
		data_center_id: number;
		sequence: number;
	}

	export function Server(port: number): void;

	export const Snowflake: {
		init: (config: SnowflakeInitConfig) => void;
		nextId: (workerId?: number, dataCenterId?: number, sequence?: number) => string;
	};
}