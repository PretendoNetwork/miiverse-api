const { Schema, model } = require('mongoose');

const endpointSchema = new Schema({
    has_error: Number,
    version: Number,
    endpoint: {
        host: String,
        api_host: String,
        portal_host: String,
        n3ds_host: String
    },
    guest: Boolean,
});

endpointSchema.methods.updateHosts = async function({host, api_host, portal_host, n3ds_host}) {
    this.set('endpoint.host', host);
    this.set('endpoint.api_host', api_host);
    this.set('endpoint.portal_host', portal_host);
    this.set('endpoint.n3ds_host', n3ds_host);
    await this.save();
};

endpointSchema.methods.updateGuest = async function(mode) {
    this.set('guest', mode);
    await this.save();
}

const ENDPOINT = model('ENDPOINT', endpointSchema);

module.exports = {
    endpointSchema,
    ENDPOINT
};
