const { ENDPOINT } = require('./models/endpoint');
const database = require('./database');

database.connect().then(async yeet => {
    const temp = await database.getCommunityByID('0');
    console.log(temp.name);
    const temp2 = await database.getPostsByCommunityKey(temp, 2, 'Warawara_03');
    console.log(temp2[1].painting.length);
});
//database.getDiscoveryHosts().then(r => console.log(r.endpoint));

//newEndpoint.save().catch(error => {console.log(error);});