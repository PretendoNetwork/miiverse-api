const mongoose = require('mongoose');
const { mongoose: mongooseConfig } = require('../config.json');
const { COMMUNITY } = require('./models/communities');
const { CONTENT } = require('./models/content');
const { CONVERSATION } = require('./models/conversation');
const { ENDPOINT } = require('./models/endpoint');
const { NOTIFICATIONS } = require('./models/notifications');
const { PNID } = require('./models/pnid');
const { POST } = require('./models/post');
const { SETTINGS } = require('./models/settings');

const { uri, database, options } = mongooseConfig;
const logger = require('./logger');
const accountDB = require('./accountdb');

let connection;

async function connect() {
    await mongoose.connect(`${uri}/${database}`, options);
    connection = mongoose.connection;
    connection.on('connected', function () {
        logger.info(`MongoDB connected ${this.name}`);
    });
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

async function getCommunities(numberOfCommunities) {
    verifyConnected();
    if(numberOfCommunities === -1)
        return COMMUNITY.find({ parent: null, type: 0 });
    else
        return COMMUNITY.find({ parent: null, type: 0 }).limit(numberOfCommunities);
}

async function getMostPopularCommunities(numberOfCommunities) {
    verifyConnected();
    return COMMUNITY.find({ parent: null, type: 0 }).sort({followers: -1}).limit(numberOfCommunities);
}

async function getNewCommunities(numberOfCommunities) {
    verifyConnected();
    return COMMUNITY.find({ parent: null, type: 0 }).sort([['created_at', -1]]).limit(numberOfCommunities);
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
        parent: null,
        removed: false
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
        parent: null,
        removed: false
    });
}

async function getPostReplies(postID, number) {
    verifyConnected();
    return POST.find({
        parent: postID,
        removed: false
    }).limit(number);
}

async function getDuplicatePosts(pid, post) {
    verifyConnected();
    return POST.findOne({
        pid: pid,
        body: post.body,
        painting: post.painting,
        screenshot: post.screenshot,
        parent: null,
        removed: false
    });
}

async function getUserPostRepliesAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return POST.find({
        parent: post.pid,
        created_at: { $lt: post.created_at },
        message_to_pid: null,
        removed: false
    }).limit(numberOfPosts);
}

async function getNumberUserPostsByID(userID, number) {
    verifyConnected();
    return POST.find({
        pid: userID,
        parent: null,
        message_to_pid: null,
        removed: false
    }).sort({ created_at: -1}).limit(number);
}

async function getTotalPostsByUserID(userID) {
    verifyConnected();
    return POST.find({
        pid: userID,
        parent: null,
        message_to_pid: null,
        removed: false
    }).countDocuments();
}

async function getHotPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).sort({empathy_count: -1}).limit(numberOfPosts);
}

async function getNumberNewCommunityPostsByID(community, number) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).sort({ created_at: -1}).limit(number);
}

async function getNumberPopularCommunityPostsByID(community, limit, offset) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).sort({ empathy_count: -1}).skip(offset).limit(limit);
}

async function getNumberVerifiedCommunityPostsByID(community, limit, offset) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        verified: true,
        parent: null,
        removed: false
    }).sort({ created_at: -1}).skip(offset).limit(limit);
}

async function getPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).limit(numberOfPosts);
}

async function getPostsByCommunityKey(community, numberOfPosts, search_key) {
    verifyConnected();
    return POST.find({
        title_id: community.title_id,
        search_key: search_key,
        parent: null,
        removed: false
    }).limit(numberOfPosts);
}

async function getNewPostsByCommunity(community, limit, offset) {
    verifyConnected();
    return POST.find({
        community_id: community.community_id,
        parent: null,
        removed: false
    }).sort({ created_at: -1 }).skip(offset).limit(limit);
}

async function getAllUserPosts(pid) {
    verifyConnected();
    return POST.find({
        pid: pid,
        message_to_pid: null
    });
}

async function getRemovedUserPosts(pid) {
    verifyConnected();
    return POST.find({
        pid: pid,
        message_to_pid: null,
        removed: true
    });
}

async function getUserPostsAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return POST.find({
        pid: post.pid,
        created_at: { $lt: post.created_at },
        parent: null,
        message_to_pid: null,
        removed: false
    }).limit(numberOfPosts);
}

async function getUserPostsOffset(pid, limit, offset) {
    verifyConnected();
    return POST.find({
        pid: pid,
        parent: null,
        message_to_pid: null,
        removed: false
    }).skip(offset).limit(limit).sort({ created_at: -1});
}

async function getCommunityPostsAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return POST.find({
        title_id: post.title_id,
        created_at: { $lt: post.created_at },
        parent: null,
        removed: false
    }).limit(numberOfPosts);
}

async function getEndpoints() {
    verifyConnected();
    return ENDPOINT.find({});
}

async function getEndPoint(accessLevel) {
    verifyConnected();
    return ENDPOINT.findOne({
        server_access_level: accessLevel
    })
}

async function getUsersSettings(numberOfUsers) {
    verifyConnected();
    if(numberOfUsers === -1)
        return SETTINGS.find({});
    else
        return SETTINGS.find({}).limit(numberOfUsers);
}

async function getUsersContent(numberOfUsers) {
    verifyConnected();
    if(numberOfUsers === -1)
        return SETTINGS.find({});
    else
        return SETTINGS.find({}).limit(numberOfUsers);
}

async function getUserSettings(pid) {
    verifyConnected();
    return SETTINGS.findOne({pid: pid});
}

async function getUserContent(pid) {
    verifyConnected();
    return CONTENT.findOne({pid: pid});
}

async function getFollowingUsers(content) {
    verifyConnected();
    return SETTINGS.find({
        pid: content.following_users
    });
}

async function getFollowedUsers(content) {
    verifyConnected();
    return SETTINGS.find({
        pid: content.followed_users
    });
}

async function getUserByUsername(user_id) {
    verifyConnected();
    return PNID.findOne({
        "username": new RegExp(`^${user_id}$`, 'i')
    });
}

async function getNewsFeed(content, numberOfPosts) {
    verifyConnected();
    return POST.find({
        $or: [
            {pid: content.followed_users},
            {pid: content.pid},
            {community_id: content.followed_communities},
        ],
        parent: null,
        message_to_pid: null,
        removed: false
    }).limit(numberOfPosts).sort({ created_at: -1});
}

async function getNewsFeedAfterTimestamp(content, numberOfPosts, post) {
    verifyConnected();
    return POST.find({
        $or: [
            {pid: content.followed_users},
            {pid: content.pid},
            {community_id: content.followed_communities},
        ],
        created_at: { $lt: post.created_at },
        parent: null,
        message_to_pid: null,
        removed: false
    }).limit(numberOfPosts).sort({ created_at: -1});
}

async function getNewsFeedOffset(content, limit, offset) {
    verifyConnected();
    return POST.find({
        $or: [
            {pid: content.followed_users},
            {pid: content.pid},
            {community_id: content.followed_communities},
        ],
        parent: null,
        message_to_pid: null,
        removed: false
    }).skip(offset).limit(limit).sort({ created_at: -1});
}

async function getConversations(pid) {
    verifyConnected();
    return CONVERSATION.find({
        "users.pid": pid
    }).sort({ last_updated: -1});
}

async function getUnreadConversationCount(pid) {
    verifyConnected();
    return CONVERSATION.find({
        "users": { $elemMatch: {
                'pid': pid,
                'read': false
            }}

    }).countDocuments();
}

async function getConversationByID(community_id) {
    verifyConnected();
    return CONVERSATION.findOne({
        type: 3,
        id: community_id
    });
}

async function getConversationMessages(community_id, limit, offset) {
    verifyConnected();
    return POST.find({
        community_id: community_id,
        parent: null,
        removed: false
    }).sort({created_at: 1}).skip(offset).limit(limit);
}

async function getConversationByUsers(pids) {
    verifyConnected();
    return CONVERSATION.findOne({
        $and: [
            {'users.pid': pids[0]},
            {'users.pid': pids[1]}
        ]
    });
}

async function getLatestMessage(pid, pid2) {
    verifyConnected();
    return POST.findOne({
        $or: [
            {pid: pid, message_to_pid: pid2},
            {pid: pid2, message_to_pid: pid}
        ],
        removed: false
    })
}

async function getPNIDS() {
    accountDB.verifyConnected();
    return PNID.find({});
}

async function getPNID(pid) {
    accountDB.verifyConnected();
    return PNID.findOne({
        pid: pid
    });
}

async function getNotifications(pid, limit, offset) {
    verifyConnected();
    return NOTIFICATIONS.find({
        pid: pid,
    }).sort({created_at: 1}).skip(offset).limit(limit);
}

async function getNotification(pid, type, reference_id) {
    verifyConnected();
    return NOTIFICATIONS.findOne({
        pid: pid,
        type: type,
        reference_id: reference_id
    })
}

async function getLastNotification(pid) {
    verifyConnected();
    return NOTIFICATIONS.findOne({
        pid: pid
    }).sort({created_at: -1}).limit(1);
}

async function getUnreadNotificationCount(pid) {
    verifyConnected();
    return NOTIFICATIONS.find({
        pid: pid,
        read: false
    }).countDocuments();
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
    getDuplicatePosts,
    getEndpoints,
    getEndPoint,
    getUserByUsername,
    getUserPostsAfterTimestamp,
    getUserPostsOffset,
    getCommunityPostsAfterTimestamp,
    getNewsFeed,
    getNewsFeedAfterTimestamp,
    getNewsFeedOffset,
    getFollowingUsers,
    getFollowedUsers,
    getConversations,
    getConversationByID,
    getConversationByUsers,
    getConversationMessages,
    getUnreadConversationCount,
    getLatestMessage,
    getPNID,
    getPNIDS,
    getUsersSettings,
    getUsersContent,
    getUserSettings,
    getUserContent,
    getNotifications,
    getUnreadNotificationCount,
    getNotification,
    getLastNotification,
    getAllUserPosts,
    getRemovedUserPosts
};
