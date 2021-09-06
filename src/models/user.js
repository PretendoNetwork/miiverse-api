const { Schema, model } = require('mongoose');

const notification = new Schema({
    content: String,
    link: String,
    read: Boolean,
    created_at: Date,
});

const  UserSchema = new Schema({
    pid: Number,
    created_at: String,
    user_id: String,
    birthday: Date,
    country: String,
    pfp_uri: String,
    mii: String,
    mii_face_url: String,
    /**
     * Account Status
     * 0 - Fine
     * 1 - Limited from Posting
     * 2 - Temporary Ban
     * 3 - Forever Ban
     */
    account_status: {
        type: Number,
        default: 0
    },
    ban_lift_date: Date,
    ban_reason: String,
    official: {
        type: Boolean,
        default: false
    },
    profile_comment: {
        type: String,
        default: undefined
    },
    game_skill: {
        type: Number,
        default: 0
    },
    game_skill_visibility: {
        type: Boolean,
        default: true
    },
    profile_comment_visibility: {
        type: Boolean,
        default: true
    },
    birthday_visibility: {
        type: Boolean,
        default: false
    },
    relationship_visibility: {
        type: Boolean,
        default: false
    },
    country_visibility: {
        type: Boolean,
        default: false
    },
    profile_favorite_community_visibility: {
        type: Boolean,
        default: true
    },
    notifications: {
        type: Boolean,
        default: false
    },
    likes: {
        type: [Number],
        default: [0]
    },
    followed_communities: {
        type: [Number],
        default: [0]
    },
    followed_users: {
        type: [Number],
        default: [0]
    },
    following_users: {
        type: [Number],
        default: [0]
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    notification_list: {
        type: [notification],
        default: [{
            content: 'This is your notifications! You\'ll see more stuff here soon!',
            link: '/users/me',
            read: false,
            created_at: new Date(),
        }]
    }

});

UserSchema.methods.getAccountStatus = async function() {
    return this.get('account_status');
};

UserSchema.methods.setAccountStatus = async function(accountStatus) {
    this.set('account_status', accountStatus);
    await this.save();
};
UserSchema.methods.getBanDate = async function() {
    return this.get('ban_lift_date');
};

UserSchema.methods.setBanData = async function(banDate) {
    this.set('ban_lift_date', banDate);
    await this.save();
};
UserSchema.methods.getProfileComment = async function() {
    return this.get('profile_comment');
};
UserSchema.methods.setProfileComment = async function(profileComment) {
    this.set('profile_comment', profileComment);
    await this.save();
};

UserSchema.methods.getGameSkill = async function() {
    return this.get('game_skill');
};

UserSchema.methods.setGameSkill = async function(gameSkill) {
    this.set('game_skill', gameSkill);
    await this.save();
};
UserSchema.methods.getGameSkillVisibility = async function() {
    return this.get('game_skill_visibility');
};

UserSchema.methods.setGameSkillVisibility = async function(gameSkillVisibility) {
    this.set('game_skill_visibility', gameSkillVisibility);
    await this.save();
};
UserSchema.methods.getProfileCommentVisibility = async function() {
    return this.get('profile_comment_visibility');
};

UserSchema.methods.setProfileCommentVisibility = async function(profileCommentVisibility) {
    this.set('profile_comment_visibility', profileCommentVisibility);
    await this.save();
};
UserSchema.methods.getBirthdayVisibility = async function() {
    return this.get('birthday_visibility');
};

UserSchema.methods.setBirthdayVisibility = async function(birthdayVisibility) {
    this.set('birthday_visibility', birthdayVisibility);
    await this.save();
};
UserSchema.methods.getRelationshipVisibility = async function() {
    return this.get('relationship_visibility');
};

UserSchema.methods.setRelationshipVisibility = async function(accountStatus) {
    this.set('relationship_visibility', accountStatus);
    await this.save();
};
UserSchema.methods.getFavoriteCommunityVisibility = async function() {
    return this.get('profile_favorite_community_visibility');
};

UserSchema.methods.setFavoriteCommunityVisibility = async function(favoriteCommunityVisibility) {
    this.set('profile_favorite_community_visibility', favoriteCommunityVisibility);
    await this.save();
};

UserSchema.methods.getCountryVisibility = async function() {
    return this.get('country_visibility');
};

UserSchema.methods.setCountryVisibility = async function(countryVisibility) {
    this.set('country_visibility', countryVisibility);
    await this.save();
};

UserSchema.methods.addToLikes = async function(postID) {
    const likes = this.get('likes');
    likes.addToSet(postID);
    await this.save();
}

UserSchema.methods.removeFromLike = async function(postID) {
    const likes = this.get('likes');
    likes.pull(postID);
    await this.save();
}

UserSchema.methods.addToCommunities = async function(postID) {
    const communities = this.get('followed_communities');
    communities.addToSet(postID);
    await this.upFollowing();
    await this.save();
}

UserSchema.methods.removeFromCommunities = async function(postID) {
    const communities = this.get('followed_communities');
    communities.pull(postID);
    await this.downFollowing();
    await this.save();
}

UserSchema.methods.addToUsers = async function(postID) {
    const users = this.get('followed_users');
    users.addToSet(postID);
    await this.upFollowing();
    await this.save();
}

UserSchema.methods.removeFromUsers = async function(postID) {
    const users = this.get('followed_users');
    users.pull(postID);
    await this.downFollowing();
    await this.save();
}

UserSchema.methods.addToFollowers = async function(postID) {
    const users = this.get('following_users');
    users.addToSet(postID);
    await this.upFollower();
    await this.save();
}

UserSchema.methods.removeFromFollowers = async function(postID) {
    const users = this.get('following_users');
    users.pull(postID);
    await this.downFollower();
    await this.save();
}

UserSchema.methods.upFollower = async function() {
    const followers = this.get('followers');
    this.set('followers', followers + 1);

    await this.save();
};

UserSchema.methods.downFollower = async function() {
    const followers = this.get('followers');
    this.set('followers', followers - 1);

    await this.save();
};

UserSchema.methods.upFollowing = async function() {
    const following = this.get('following');
    this.set('following', following + 1);

    await this.save();
};

UserSchema.methods.downFollowing = async function() {
    const following = this.get('following');
    this.set('following', following - 1);

    await this.save();
};

const USER = model('USER', UserSchema);

module.exports = {
    UserSchema,
    USER
};