const { Schema, model } = require('mongoose');
const { PostSchema } = require('./post');

const titleIdsSchema = new Schema({
    title_id: String,
});

const personSchema = new Schema({
    posts: {
        type: [PostSchema],
        default: undefined
    }
});

const TopicSchema = new Schema({
    empathy_count: {
        type: Number,
        default: 0
    },
    has_shop_page: {
        type: Number,
        default: 0
    },
    icon: String,
    title_ids: {
        type: [titleIdsSchema],
        default: undefined
    },
    title_id: String,
    community_id: String,
    is_recommended: {
        type: Number,
        default: 0
    },
    name: String,
    people: {
        type: [personSchema],
        default: undefined
    },
});

TopicSchema.methods.upEmpathy = async function() {
    const empathy = this.get('empathy_count');
    this.set('empathy_count', empathy + 1);

    await this.save();
};

TopicSchema.methods.downEmpathy = async function() {
    const empathy = this.get('empathy_count');
    this.set('empathy_count', empathy - 1);

    await this.save();
};

TopicSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.set('usernameLower', this.get('username').toLowerCase());
    await this.generatePID();
    await this.generateNEXPassword();
    await this.generateEmailValidationCode();
    await this.generateEmailValidationToken();

    const primaryHash = util.nintendoPasswordHash(this.get('password'), this.get('pid'));
    const hash = bcrypt.hashSync(primaryHash, 10);

    this.set('password', hash);
    next();
});

const MiiverseTopic = model('MiiverseTopic', PostSchema);

module.exports = {
    TopicSchema,
    MiiverseTopic
};