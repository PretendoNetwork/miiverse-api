const { Schema, model } = require('mongoose');

const SettingsSchema = new Schema({
    pid: String,
    screen_name: String,
    account_status: {
        type: Number,
        default: 0
    },
    ban_lift_date: Date,
    ban_reason: String,
    profile_comment: {
        type: String,
        default: undefined
    },
    profile_comment_visibility: {
        type: Boolean,
        default: true
    },
    game_skill: {
        type: Number,
        default: 0
    },
    game_skill_visibility: {
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
    receive_notifications: {
        type: Boolean,
        default: true
    }
});

SettingsSchema.methods.updateComment = async function(comment) {
    this.set('profile_comment', comment);
    await this.save();
};

SettingsSchema.methods.updateSkill = async function(skill) {
    this.set('game_skill', skill);
    await this.save();
};

SettingsSchema.methods.commentVisible = async function(active) {
    this.set('profile_comment_visibility', active);
    await this.save();
};

SettingsSchema.methods.skillVisible = async function(active) {
    this.set('game_skill_visibility', active);
    await this.save();
};

SettingsSchema.methods.birthdayVisible = async function(active) {
    this.set('birthday_visibility', active);
    await this.save();
};

SettingsSchema.methods.relationshipVisible = async function(active) {
    this.set('relationship_visibility', active);
    await this.save();
};

SettingsSchema.methods.countryVisible = async function(active) {
    this.set('country_visibility', active);
    await this.save();
};

SettingsSchema.methods.favCommunityVisible = async function(active) {
    this.set('profile_favorite_community_visibility', active);
    await this.save();
};

const SETTINGS = model('SETTINGS', SettingsSchema);

module.exports = {
    SettingsSchema,
    SETTINGS
};
