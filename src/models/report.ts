import { Schema, model } from 'mongoose';
import { IReport, IReportMethods, ReportModel } from '@/types/mongoose/report';

const ReportSchema = new Schema<IReport, ReportModel, IReportMethods>({
	pid: String,
	post_id: String,
	reason: Number,
	created_at: {
		type: Date,
		default: new Date()
	}
});

export const Report: ReportModel = model<IReport, ReportModel>('Report', ReportSchema);
