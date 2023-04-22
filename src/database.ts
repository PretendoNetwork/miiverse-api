import mongoose from 'mongoose';
import { verifyConnected as accountDBVerifyConnected } from '@/accountdb';
import { LOG_INFO } from '@/logger';
import { Community } from '@/models/community';
import { Content } from '@/models/content';
import { Conversation } from '@/models/conversation';
import { Endpoint } from '@/models/endpoint';
import { Notification } from '@/models/notification';
import { PNID } from '@/models/pnid';
import { Post } from '@/models/post';
import { Settings } from '@/models/settings';

import { mongoose as mongooseConfig } from '../config.json';

const { uri, database, options } = mongooseConfig;

let connection;

export async function connect() {
    await mongoose.connect(`${uri}/${database}`, options as mongoose.ConnectOptions || {});
    connection = mongoose.connection;
    connection.on('connected', function () {
        LOG_INFO(`MongoDB connected ${this.name}`);
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

export async function getCommunities(numberOfCommunities) {
    verifyConnected();
    if (numberOfCommunities === -1)
        return Community.find({ parent: null, type: 0 });
    else
        return Community.find({ parent: null, type: 0 }).limit(numberOfCommunities);
}

export async function getMostPopularCommunities(numberOfCommunities) {
    verifyConnected();
    return Community.find({ parent: null, type: 0 }).sort({ followers: -1 }).limit(numberOfCommunities);
}

export async function getNewCommunities(numberOfCommunities) {
    verifyConnected();
    return Community.find({ parent: null, type: 0 }).sort([['created_at', -1]]).limit(numberOfCommunities);
}

export async function getSubCommunities(communityID) {
    verifyConnected();
    return Community.find({
        parent: communityID
    });
}

export async function getCommunityByTitleID(title_id) {
    verifyConnected();
    return Community.findOne({
        title_id: title_id
    });
}

export async function getCommunityByTitleIDs(title_ids) {
    verifyConnected();
    return Community.findOne({
        title_ids: { $in: title_ids }
    });
}

export async function getCommunityByID(community_id) {
    verifyConnected();
    return Community.findOne({
        community_id: community_id
    });
}

export async function getTotalPostsByCommunity(community) {
    verifyConnected();
    return Post.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).countDocuments();
}

export async function getPostByID(postID) {
    verifyConnected();
    return Post.findOne({
        id: postID
    });
}

export async function getPostsByUserID(userID) {
    verifyConnected();
    return Post.find({
        pid: userID,
        parent: null,
        removed: false,
        app_data: { $ne: null }
    });
}

export async function getPostReplies(postID, number) {
    verifyConnected();
    return Post.find({
        parent: postID,
        removed: false,
        app_data: { $ne: null }
    }).limit(number);
}

export async function getDuplicatePosts(pid, post) {
    verifyConnected();
    return Post.findOne({
        pid: pid,
        body: post.body,
        painting: post.painting,
        screenshot: post.screenshot,
        parent: null,
        removed: false
    });
}

export async function getUserPostRepliesAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return Post.find({
        parent: post.pid,
        created_at: { $lt: post.created_at },
        message_to_pid: null,
        removed: false,
        app_data: { $ne: null }
    }).limit(numberOfPosts);
}

export async function getNumberUserPostsByID(userID, number) {
    verifyConnected();
    return Post.find({
        pid: userID,
        parent: null,
        message_to_pid: null,
        removed: false
    }).sort({ created_at: -1 }).limit(number);
}

export async function getTotalPostsByUserID(userID) {
    verifyConnected();
    return Post.find({
        pid: userID,
        parent: null,
        message_to_pid: null,
        removed: false
    }).countDocuments();
}

export async function getHotPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return Post.find({
        title_id: community.title_id,
        parent: null,
        removed: false,
        app_data: { $ne: null }
    }).sort({ empathy_count: -1 }).limit(numberOfPosts);
}

export async function getNumberNewCommunityPostsByID(community, number) {
    verifyConnected();
    return Post.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).sort({ created_at: -1 }).limit(number);
}

export async function getNumberPopularCommunityPostsByID(community, limit, offset) {
    verifyConnected();
    return Post.find({
        title_id: community.title_id,
        parent: null,
        removed: false
    }).sort({ empathy_count: -1 }).skip(offset).limit(limit);
}

export async function getNumberVerifiedCommunityPostsByID(community, limit, offset) {
    verifyConnected();
    return Post.find({
        title_id: community.title_id,
        verified: true,
        parent: null,
        removed: false
    }).sort({ created_at: -1 }).skip(offset).limit(limit);
}

export async function getPostsByCommunity(community, numberOfPosts) {
    verifyConnected();
    return Post.find({
        community_id: community.olive_community_id,
        parent: null,
        removed: false,
        app_data: { $ne: null }
    }).sort({ created_at: -1 }).limit(numberOfPosts);
}

export async function getPostsByCommunityKey(community, numberOfPosts, search_key) {
    verifyConnected();
    return Post.find({
        community_id: community.olive_community_id,
        search_key: search_key,
        parent: null,
        removed: false,
        app_data: { $ne: null }
    }).sort({ created_at: -1 }).limit(numberOfPosts);
}

export async function getNewPostsByCommunity(community, limit, offset) {
    verifyConnected();
    return Post.find({
        community_id: community.olive_community_id,
        parent: null,
        removed: false,
        app_data: { $ne: null }
    }).sort({ created_at: -1 }).skip(offset).limit(limit);
}

export async function getAllUserPosts(pid) {
    verifyConnected();
    return Post.find({
        pid: pid,
        message_to_pid: null,
        app_data: { $ne: null }
    });
}

export async function getRemovedUserPosts(pid) {
    verifyConnected();
    return Post.find({
        pid: pid,
        message_to_pid: null,
        removed: true
    });
}

export async function getUserPostsAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return Post.find({
        pid: post.pid,
        created_at: { $lt: post.created_at },
        parent: null,
        message_to_pid: null,
        removed: false,
        app_data: { $ne: null }
    }).limit(numberOfPosts);
}

export async function getUserPostsOffset(pid, limit, offset) {
    verifyConnected();
    return Post.find({
        pid: pid,
        parent: null,
        message_to_pid: null,
        removed: false,
        app_data: { $ne: null }
    }).skip(offset).limit(limit).sort({ created_at: -1 });
}

export async function getCommunityPostsAfterTimestamp(post, numberOfPosts) {
    verifyConnected();
    return Post.find({
        title_id: post.title_id,
        created_at: { $lt: post.created_at },
        parent: null,
        removed: false,
        app_data: { $ne: null }
    }).limit(numberOfPosts);
}

export async function getEndpoints() {
    verifyConnected();
    return Endpoint.find({});
}

export async function getEndPoint(accessLevel) {
    verifyConnected();
    return Endpoint.findOne({
        server_access_level: accessLevel
    })
}

export async function getUsersSettings(numberOfUsers) {
    verifyConnected();
    if (numberOfUsers === -1)
        return Settings.find({});
    else
        return Settings.find({}).limit(numberOfUsers);
}

export async function getUsersContent(numberOfUsers) {
    verifyConnected();
    if (numberOfUsers === -1)
        return Settings.find({});
    else
        return Settings.find({}).limit(numberOfUsers);
}

export async function getUserSettings(pid) {
    verifyConnected();
    return Settings.findOne({ pid: pid });
}

export async function getUserContent(pid) {
    verifyConnected();
    return Content.findOne({ pid: pid });
}

export async function getFollowingUsers(content) {
    verifyConnected();
    return Settings.find({
        pid: content.following_users
    });
}

export async function getFollowedUsers(content) {
    verifyConnected();
    return Settings.find({
        pid: content.followed_users
    });
}

export async function getUserByUsername(user_id) {
    verifyConnected();
    return PNID.findOne({
        "username": new RegExp(`^${user_id}$`, 'i')
    });
}

export async function getNewsFeed(content, numberOfPosts) {
    verifyConnected();
    return Post.find({
        $or: [
            { pid: content.followed_users },
            { pid: content.pid },
            { community_id: content.followed_communities },
        ],
        parent: null,
        message_to_pid: null,
        removed: false
    }).limit(numberOfPosts).sort({ created_at: -1 });
}

export async function getNewsFeedAfterTimestamp(content, numberOfPosts, post) {
    verifyConnected();
    return Post.find({
        $or: [
            { pid: content.followed_users },
            { pid: content.pid },
            { community_id: content.followed_communities },
        ],
        created_at: { $lt: post.created_at },
        parent: null,
        message_to_pid: null,
        removed: false
    }).limit(numberOfPosts).sort({ created_at: -1 });
}

export async function getNewsFeedOffset(content, limit, offset) {
    verifyConnected();
    return Post.find({
        $or: [
            { pid: content.followed_users },
            { pid: content.pid },
            { community_id: content.followed_communities },
        ],
        parent: null,
        message_to_pid: null,
        removed: false
    }).skip(offset).limit(limit).sort({ created_at: -1 });
}

export async function getConversations(pid) {
    verifyConnected();
    return Conversation.find({
        "users.pid": pid
    }).sort({ last_updated: -1 });
}

export async function getUnreadConversationCount(pid) {
    verifyConnected();
    return Conversation.find({
        "users": {
            $elemMatch: {
                'pid': pid,
                'read': false
            }
        }

    }).countDocuments();
}

export async function getConversationByID(community_id) {
    verifyConnected();
    return Conversation.findOne({
        type: 3,
        id: community_id
    });
}

export async function getConversationMessages(community_id, limit, offset) {
    verifyConnected();
    return Post.find({
        community_id: community_id,
        parent: null,
        removed: false
    }).sort({ created_at: 1 }).skip(offset).limit(limit);
}

export async function getConversationByUsers(pids) {
    verifyConnected();
    return Conversation.findOne({
        $and: [
            { 'users.pid': pids[0] },
            { 'users.pid': pids[1] }
        ]
    });
}

export async function getLatestMessage(pid, pid2) {
    verifyConnected();
    return Post.findOne({
        $or: [
            { pid: pid, message_to_pid: pid2 },
            { pid: pid2, message_to_pid: pid }
        ],
        removed: false
    })
}

export async function getFriendMessages(pid, search_key, limit) {
    verifyConnected();
    return Post.find({
        message_to_pid: pid,
        search_key: search_key,
        parent: null,
        removed: false
    }).sort({ created_at: 1 }).limit(limit);
}

export async function getPNIDS() {
    accountDBVerifyConnected();
    return PNID.find({});
}

export async function getPNID(pid) {
    accountDBVerifyConnected();
    return PNID.findOne({
        pid: pid
    });
}

export async function getNotifications(pid, limit, offset) {
    verifyConnected();
    return Notification.find({
        pid: pid,
    }).sort({ created_at: 1 }).skip(offset).limit(limit);
}

export async function getNotification(pid, type, reference_id) {
    verifyConnected();
    return Notification.findOne({
        pid: pid,
        type: type,
        reference_id: reference_id
    })
}

export async function getLastNotification(pid) {
    verifyConnected();
    return Notification.findOne({
        pid: pid
    }).sort({ created_at: -1 }).limit(1);
}

export async function getUnreadNotificationCount(pid) {
    verifyConnected();
    return Notification.find({
        pid: pid,
        read: false
    }).countDocuments();
}