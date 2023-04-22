// to make the file a module and avoid the TypeScript error
export {};

declare global {
	namespace Express {
		interface Request {
			pid: number;
		}
	}
}