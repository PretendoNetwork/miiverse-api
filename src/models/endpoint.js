const { Schema, model } = require('mongoose');

const endpointSchema = new Schema({
    status: Number,
    server_access_level: String,
    topics: Boolean,
    guest_access: Boolean,
    host: String,
    api_host: String,
    portal_host: String,
    n3ds_host: String
});

const ENDPOINT = model('ENDPOINT', endpointSchema);

module.exports = {
    endpointSchema,
    ENDPOINT
};
