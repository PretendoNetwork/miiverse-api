import { Schema, model } from 'mongoose';
import type { IReport, ReportModel } from '@/types/mongoose/report';

const ReportSchema = new Schema<IReport, ReportModel>({
	pid: String,
	post_id: String,
	reason: Number,
	created_at: {
		type: Date,
		default: new Date()
	}
});

export const Report = model<IReport, ReportModel>('Report', ReportSchema);
