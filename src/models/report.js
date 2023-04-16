const { Schema, model } = require('mongoose');

const ReportSchema = new Schema({
    pid: String,
    post_id: String,
    reason: Number,
    created_at: {
        type: Date,
        default: new Date()
    }
});

const REPORT = model('REPORT', ReportSchema);

module.exports = {
    ReportSchema,
    REPORT
};
