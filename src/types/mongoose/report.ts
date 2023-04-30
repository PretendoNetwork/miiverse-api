import { Model, HydratedDocument } from 'mongoose';

export interface IReport {
	pid: string;
    post_id: string;
    reason: number;
    created_at: Date;
}

export interface IReportMethods {}

interface IReportQueryHelpers {}

export interface ReportModel extends Model<IReport, IReportQueryHelpers, IReportMethods> {}

export type HydratedReportDocument = HydratedDocument<IReport, IReportMethods>