import type { Model, HydratedDocument } from 'mongoose';

export interface IReport {
	pid: string;
	post_id: string;
	reason: number;
	created_at: Date;
}

export type ReportModel = Model<IReport>;

export type HydratedReportDocument = HydratedDocument<IReport>;
