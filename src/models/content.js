const { Schema, model } = require('mongoose');

const  ContentSchema = new Schema({
    pid: String,
    likes: {
        type: [String],
        default: [0]
    },
    followed_communities: {
        type: [String],
        default: [0]
    },
    followed_users: {
        type: [String],
        default: [0]
    },
    following_users: {
        type: [String],
        default: [0]
    },
});

ContentSchema.methods.addToLikes = async function(postID) {
    const likes = this.get('likes');
    likes.addToSet(postID);
    await this.save();
}

ContentSchema.methods.removeFromLike = async function(postID) {
    const likes = this.get('likes');
    likes.pull(postID);
    await this.save();
}

ContentSchema.methods.addToCommunities = async function(postID) {
    const communities = this.get('followed_communities');
    communities.addToSet(postID);
    await this.save();
}

ContentSchema.methods.removeFromCommunities = async function(postID) {
    const communities = this.get('followed_communities');
    communities.pull(postID);
    await this.save();
}

ContentSchema.methods.addToUsers = async function(postID) {
    const users = this.get('followed_users');
    users.addToSet(postID);
    await this.save();
}

ContentSchema.methods.removeFromUsers = async function(postID) {
    const users = this.get('followed_users');
    users.pull(postID);
    await this.save();
}

ContentSchema.methods.addToFollowers = async function(postID) {
    const users = this.get('following_users');
    users.addToSet(postID);
    await this.save();
}

ContentSchema.methods.removeFromFollowers = async function(postID) {
    const users = this.get('following_users');
    users.pull(postID);
    await this.save();
}

const CONTENT = model('CONTENT', ContentSchema);

module.exports = {
    ContentSchema,
    CONTENT
};
