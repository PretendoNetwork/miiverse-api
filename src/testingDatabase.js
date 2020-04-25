const { ENDPOINT } = require('./models/endpoint');
const database = require('./database');



const doc = {
    has_error: 0,
    version: 1,
    endpoint: {
        host: "host1",
        api_host: "host2",
        portal_host: "host3",
        n3ds_host: "host4"
    }
};
const newEndpoint = new ENDPOINT(doc);
database.connect().then(async yeet => {
    const temp = await database.getServerConfig();
    console.log(temp);
});
//database.getDiscoveryHosts().then(r => console.log(r.endpoint));

//newEndpoint.save().catch(error => {console.log(error);});