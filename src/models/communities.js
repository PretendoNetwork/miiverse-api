const { Schema, model } = require('mongoose');

const  CommunitySchema = new Schema({
    empathy_count: {
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

const COMMUNITY = model('COMMUNITY', CommunitySchema);

module.exports = {
    CommunitySchema,
    COMMUNITY
};