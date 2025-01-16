import type { ParamPack } from '@/types/common/param-pack';

declare global {
	namespace Express {
		interface Request {
			pid: number;
			paramPack: ParamPack;
		}
	}
}
