const xmlbuilder = require("xmlbuilder");
const moment = require("moment-timezone");

class CommunityPostGen {
    /*  TODO lots of stubs and constants in here */
    static async PostsResponse(posts, community) {
        let xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up()
            .e("request_name", "posts").up()
            .e("topic")
            .e("community_id", community.id).up()
            .up()
            .e("posts");
        for (let i = 0; i < posts.length; i++) {
            xml = xml.e("post")
                .e("app_data", posts[i].appData).up()
                .e("body", posts[i].body).up()
                .e("community_id", community.id).up()
                .e("country_id", "254").up()
                .e("created_at", moment(posts[i].created).tz("GMT").format("YYYY-MM-DD hh:mm:ss")).up()
                .e("feeling_id", "1").up()
                .e("id", posts[i].id).up()
                .e("is_autopost", "0").up()
                .e("is_community_private_autopost", "0").up()
                .e("is_spoiler", "0").up()
                .e("is_app_jumpable", "0").up()
                .e("empathy_count", posts[i].empathy).up()
                .e("language_id", "1").up()
                .e("number", "0").up();
            if (posts[i].painting) {
                xml = xml.e("painting")
                    .e("format", "tga").up()
                    .e("content", posts[i].painting).up()
                    .e("size", posts[i].paintingSz).up()
                    .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                    .up();
            }
            xml = xml.e("pid", posts[i].pid).up()
                .e("platform_id", "1").up()
                .e("region_id", "4").up()
                .e("reply_count", "0").up()
                .e("screen_name", posts[i].screenName).up()
                .e("title_id", posts[i].tid).up()
                .up();
        }

        return xml.end({ pretty: true, allowEmpty: true });
    }

    static async EmptyResponse() {
        const xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up();
        return xml.end({ pretty: true, allowEmpty: true });
    }

    /*  TODO Again, some constants */
    static async SinglePostResponse(post) {
        let xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up()
            .e("post");
        if (post.appData) {
            xml = xml.e("app_data", post.appData).up();
        }
        xml = xml.e("body", post.body).up()
            .e("community_id", post.communityID).up()
            .e("country_id", "254").up()
            .e("created_at", moment(post.created).tz("GMT").format("YYYY-MM-DD hh:mm:ss")).up()
            .e("feeling_id", "1").up()
            .e("id", post.id).up()
            .e("is_autopost", "0").up()
            .e("is_community_private_autopost", "0").up()
            .e("is_spoiler", "0").up()
            .e("is_app_jumpable", "0").up()
            .e("empathy_count", post.empathy).up()
            .e("language_id", "1").up()
            .e("number", "0").up();
        if (post.painting) {
            xml = xml.e("painting")
                .e("format", "tga").up()
                .e("content", post.painting).up()
                .e("size", post.paintingSz).up()
                .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                .up();
        }
        xml = xml.e("pid", post.pid).up()
            .e("platform_id", "1").up()
            .e("region_id", "4").up()
            .e("reply_count", "0").up()
            .e("screen_name", post.screenName).up()
            .e("title_id", post.tid).up()
            .up();
        return xml.end({ pretty: true, allowEmpty: true });
    }
}

if (typeof module !== "undefined") {
    module.exports = CommunityPostGen;
}
