const mongoose = require('mongoose');
const { mongoose: mongooseConfig } = require('./config.json');
const { TOPIC } = require('./models/topic');
const { ENDPOINT } = require('./models/endpoint');
const { COMMUNITY } = require('./models/communities');
const { POST } = require('./models/post');
const { uri, database, options } = mongooseConfig;

let connection;

async function connect() {
    await mongoose.connect(`${uri}/${database}`, options);

    connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
}

function verifyConnected() {
    if (!connection) {
        throw new Error('Cannot make database requets without being connected');
    }
}

async function getTopicByName(topicName) {
    verifyConnected();

    if (typeof topicName !== 'string') {
        return null;
    }

    return TOPIC.findOne({
        name: topicName
    });
}

async function getTopicByCommunityID(communityID) {
    verifyConnected();

    if (typeof communityID !== 'string') {
        return null;
    }

    return TOPIC.findOne({
        community_id: communityID
    });
}

async function getCommunityByTitleID(title_id) {
    verifyConnected();
    return COMMUNITY.findOne({
        title_id: title_id
    });
}

async function getCommunityByID(community_id) {
    verifyConnected();

    return COMMUNITY.findOne({
        community_id: community_id
    });
}

async function getPostsByCommunity(community, numberOfPosts) {
    verifyConnected();

    return POST.find({
        title_id: community.title_id
    }).limit(numberOfPosts.value);
}

async function getPostsByCommunityKey(community, numberOfPosts, search_key) {
    verifyConnected();
    console.log(community.title_id);
    return POST.find({
        title_id: community.title_id,
        search_key: search_key
    }).limit(numberOfPosts);
}

async function getDiscoveryHosts() {
    verifyConnected();
    return ENDPOINT.findOne({
        version: 1
    });
}

async function getServerConfig() {
    verifyConnected();
    return ENDPOINT.findOne({
        type: "config"
    });
}

module.exports = {
    connect,
    getTopicByName,
    getTopicByCommunityID,
    getCommunityByTitleID,
    getCommunityByID,
    getDiscoveryHosts,
    getPostsByCommunity,
    getPostsByCommunityKey,
    getServerConfig
};