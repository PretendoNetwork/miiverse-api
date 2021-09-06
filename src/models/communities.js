const { Schema, model } = require('mongoose');

const  CommunitySchema = new Schema({
    created_at: {
      type: Date,
        default: new Date(),
    },
    empathy_count: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    id: {
        type: Number,
        default: 0
    },
    has_shop_page: {
        type: Number,
        default: 0
    },
    icon: String,
    title_ids: {
        type: [String],
        default: undefined
    },
    title_id: {
        type: [String],
        default: undefined
    },
    community_id: String,
    is_recommended: {
        type: Number,
        default: 0
    },
    platform_id: Number,
    name: String,
    browser_icon: String,
    CTR_browser_header: String,
    WiiU_browser_header: String,
    description: String,
    parent: {
        type: Number,
        default: null
    }
});

CommunitySchema.methods.upEmpathy = async function() {
    const empathy = this.get('empathy_count');
    this.set('empathy_count', empathy + 1);

    await this.save();
};

CommunitySchema.methods.downEmpathy = async function() {
    const empathy = this.get('empathy_count');
    this.set('empathy_count', empathy - 1);

    await this.save();
};

CommunitySchema.methods.upFollower = async function() {
    const followers = this.get('followers');
    this.set('followers', followers + 1);

    await this.save();
};

CommunitySchema.methods.downFollower = async function() {
    const followers = this.get('followers');
    this.set('followers', followers - 1);

    await this.save();
};

const COMMUNITY = model('COMMUNITY', CommunitySchema);

module.exports = {
    CommunitySchema,
    COMMUNITY
};