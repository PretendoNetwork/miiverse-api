const mongoose = require('mongoose');
const { mongoose: mongooseConfig } = require('./config.json');
const { TOPIC } = require('./models/topic');
const { ENDPOINT } = require('./models/endpoint');
const { COMMUNITY } = require('./models/communities');
const { POST } = require('./models/post');
const { USER } = require('./models/user');
const { CONVERSATION } = require('./models/conversation');
const { uri, database, options } = mongooseConfig;

let connection;

async function connect() {
    await mongoose.connect(`${uri}/${database}`, options);

    connection = mongoose.connection;
    connection.on('error', console.error.bind(console, 'connection error:'));
    connection.on('close', () => {
        connection.removeAllListeners();
    });
}

function verifyConnected() {
    if (!connection) {
        connect();
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

async function getCommunities(numberOfCommunities) {
    verifyConnected();
    if(numberOfCommunities === -1)
        return COMMUNITY.find({ parent: null });
    else
        return COMMUNITY.find({ parent: null }).limit(numberOfCommunities);
}

async function getMostPopularCommunities(numberOfCommunities) {
    verifyConnected();
    return COMMUNITY.find({ parent: null }).sort({followers: -1}).limit(numberOfCommunities);
}

async function getNewCommunities(numberOfCommunities) {
    verifyConnected();
    return COMMUNITY.find({ parent: null }).sort([['created_at', -1]]).limit(numberOfCommunities);
}

async function getSubCommunities(communityID) {
    verifyConnected();
    return COMMUNITY.find({
        parent: communityID
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

async function getTotalPostsByCommunity(community) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null
    }).countDocuments();
}

async function getPostByID(postID) {
    verifyConnected();

    return POST.findOne({
        id: postID
    });
}

async function getPostsByUserID(userID) {
    verifyConnected();
    return POST.find({
        pid: userID,
        parent: null
    });
}

async function getPostReplies(postID, number) {
    verifyConnected();
    return POST.find({
        parent: postID
    }).limit(number);
}

async function getUserPostRepliesAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return POST.find({
        parent: post.pid,
        created_at: { $lt: post.created_at }
    }).limit(numberOfPosts);
}

async function getNumberUserPostsByID(userID, number) {
    verifyConnected();
    return POST.find({
        pid: userID,
        parent: null
    }).sort({ created_at: -1}).limit(number);
}

async function getTotalPostsByUserID(userID) {
    verifyConnected();
    return POST.find({
        pid: userID,
        parent: null
    }).countDocuments();
}

async function getHotPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null
    }).sort({empathy_count: -1}).limit(numberOfPosts);
}

async function getNumberNewCommunityPostsByID(community, number) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null
    }).sort({ created_at: -1}).limit(number);
}

async function getNumberPopularCommunityPostsByID(community, number) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null
    }).sort({ empathy_count: -1}).limit(number);
}

async function getNumberVerifiedCommunityPostsByID(community, number) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        verified: true,
        parent: null
    }).sort({ created_at: -1}).limit(number);
}

async function getPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null
    }).limit(numberOfPosts);
}

async function getPostsByCommunityKey(community, numberOfPosts, search_key) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        search_key: search_key,
        parent: null
    }).limit(numberOfPosts);
}

async function getNewPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return POST.find({
        community_id: community.community_id,
        parent: null
    }).sort({ created_at: -1 }).limit(numberOfPosts);
}

async function getUserPostsAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return POST.find({
        pid: post.pid,
        created_at: { $lt: post.created_at },
        parent: null
    }).limit(numberOfPosts);
}

async function getCommunityPostsAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return POST.find({
        title_id: post.title_id,
        created_at: { $lt: post.created_at },
        parent: null
    }).limit(numberOfPosts);
}

async function pushNewNotificationByPID(PID, content, link) {
    verifyConnected();
    return USER.update(
        { pid: PID }, { $push: { notification_list: { content: content, link: link, read: false, created_at: Date() }}});
}

async function pushNewNotificationToAll(content, link) {
    verifyConnected();
    return USER.updateMany(
        {}, { $push: { notification_list: { content: content, link: link, read: false, created_at: Date() }}});
}

async function getDiscoveryHosts() {
    verifyConnected();
    return ENDPOINT.findOne({
        version: 1
    });
}

async function getUsers(numberOfUsers) {
    verifyConnected();
    if(numberOfUsers === -1)
        return USER.find({});
    else
        return USER.find({}).limit(numberOfUsers);
}

async function getFollowingUsers(user) {
    verifyConnected();
    return USER.find({
        pid: user.following_users
    });
}
async function getFollowedUsers(user) {
    verifyConnected();
    return USER.find({
        pid: user.followed_users
    });
}

async function getUserByPID(PID) {
    verifyConnected();

    return USER.findOne({
        pid: PID
    });
}

async function getUserByUsername(user_id) {
    verifyConnected();

    return USER.findOne({
        user_id: new RegExp(`^${user_id}$`, 'i')
    });
}

async function getServerConfig() {
    verifyConnected();
    return ENDPOINT.findOne();
}

async function getNewsFeed(user, numberOfPosts) {
    verifyConnected();
    return POST.find({
        $or: [
            {pid: user.followed_users},
            {pid: user.pid}
        ],
        parent: null
    }).limit(numberOfPosts).sort({ created_at: -1});
}

async function getNewsFeedAfterTimestamp(user, numberOfPosts, post) {
    verifyConnected();
    return POST.find({
        $or: [
            {pid: user.followed_users},
            {pid: user.pid}
        ],
        created_at: { $lt: post.created_at },
        parent: null
    }).limit(numberOfPosts).sort({ created_at: -1});
}

async function getConversations(pid) {
    verifyConnected();
    return CONVERSATION.find({
        pids: pid
    });
}

async function getConversation(pid, pid2) {
    verifyConnected();
    return CONVERSATION.findOne({
        pids: {
            $all: [pid, pid2]
        }
    });
}

module.exports = {
    connect,
    getCommunities,
    getMostPopularCommunities,
    getNewCommunities,
    getSubCommunities,
    getCommunityByTitleID,
    getCommunityByID,
    getTotalPostsByCommunity,
    getDiscoveryHosts,
    getPostsByCommunity,
    getHotPostsByCommunity,
    getNumberNewCommunityPostsByID,
    getNumberPopularCommunityPostsByID,
    getNumberVerifiedCommunityPostsByID,
    getNewPostsByCommunity,
    getPostsByCommunityKey,
    getPostsByUserID,
    getPostReplies,
    getUserPostRepliesAfterTimestamp,
    getNumberUserPostsByID,
    getTotalPostsByUserID,
    getPostByID,
    getUsers,
    getUserByPID,
    getUserByUsername,
    getUserPostsAfterTimestamp,
    getCommunityPostsAfterTimestamp,
    getServerConfig,
    pushNewNotificationByPID,
    pushNewNotificationToAll,
    getNewsFeed,
    getNewsFeedAfterTimestamp,
    getFollowingUsers,
    getFollowedUsers,
    getConversations,
    getConversation,
};