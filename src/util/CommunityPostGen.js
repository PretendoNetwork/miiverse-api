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
            .e("community_id", community.community_id).up()
            .up()
            .e("posts");
        for (let i = 0; i < posts.length; i++) {
            xml = xml.e("post")
                .e("app_data", posts[i].app_data).up()
                .e("body", posts[i].body).up()
                .e("community_id", community.community_id).up()
                .e("country_id", "254").up()
                .e("created_at", posts[i].created_at).up()
                .e("feeling_id", "1").up()
                .e("id", posts[i].id).up()
                .e("is_autopost", "0").up()
                .e("is_community_private_autopost", "0").up()
                .e("is_spoiler", "0").up()
                .e("is_app_jumpable", "0").up()
                .e("empathy_count", posts[i].empathy_count).up()
                .e("language_id", "1").up();
                if(posts[i].mii) {
                    xml = xml.e("mii", posts[i].mii).up()
                             .e("mii_face_url", posts[i].mii_face_url).up()
                }
                xml = xml.e("number", "0").up();

            if (posts[i].painting) {
                xml = xml.e("painting")
                    .e("format", "tga").up()
                    .e("content", posts[i].painting).up()
                    .e("size", posts[i].painting.length).up()
                    .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                    .up();
            }
            xml = xml.e("pid", i + 1).up()
                .e("platform_id", "1").up()
                .e("region_id", "4").up()
                .e("reply_count", "0").up()
                .e("screen_name", posts[i].screen_name).up()
                .e("title_id", posts[i].title_id).up()
                .up();
        }

        return xml.end({ pretty: true, allowEmpty: true });
    }

    static async PostsResponseWithMii(posts, community) {
        let xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up()
            .e("request_name", "posts").up()
            .e("topic")
            .e("community_id", community.community_id).up()
            .up()
            .e("posts");
        for (let i = 0; i < posts.length; i++) {
            xml = xml.e("post")
                .e("app_data", posts[i].app_data).up()
                .e("body", posts[i].body).up()
                .e("community_id", community.community_id).up()
                .e("country_id", "254").up()
                .e("created_at", posts[i].created_at).up()
                .e("feeling_id", "1").up()
                .e("id", posts[i].id).up()
                .e("is_autopost", "0").up()
                .e("is_community_private_autopost", "0").up()
                .e("is_spoiler", "0").up()
                .e("is_app_jumpable", "0").up()
                .e("empathy_count", posts[i].empathy_count).up()
                .e("language_id", "1").up()
                .e("mii", posts[i].mii).up()
                .e("mii_face_url", posts[i].mii_face_url).up()
                .e("number", "0").up();
            if (posts[i].painting) {
                xml = xml.e("painting")
                    .e("format", "tga").up()
                    .e("content", posts[i].painting).up()
                    .e("size", posts[i].painting.length).up()
                    .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                    .up();
            }
            xml = xml.e("pid", i + 1).up()
                .e("platform_id", "1").up()
                .e("region_id", "4").up()
                .e("reply_count", "0").up()
                .e("screen_name", posts[i].screen_name).up()
                .e("title_id", posts[i].title_id).up()
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

    static async Communities(community) {
        const xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up()
            .e("request_name", "communities").up()
            .e("communities")
                .e("community")
                    .e('olive_community_id', community.community_id).up()
                    .e('community_id', community.community_id).up()
                    .e("name", community.name).up()
                    .e("description", community.description).up()
                    .e("icon").up()
                    .e("icon_3ds").up()
                    .e("pid").up()
                    .e("app_data").up()
                    .e("is_user_community", 0).up()
                .up()
                .e("community")
                    .e('olive_community_id', community.community_id + 100).up()
                    .e('community_id', community.community_id + 100).up()
                    .e("name", community.name + '- Nintendo Levels').up()
                    .e("description", community.description).up()
                    .e("icon").up()
                    .e("icon_3ds").up()
                    .e("pid").up()
                    .e("app_data", 'TVZNSQI').up()
                    .e("is_user_community", 0).up()
                .up()
                .e("community")
                    .e('olive_community_id', community.community_id + 200).up()
                    .e('community_id', community.community_id + 200).up()
                    .e("name", community.name + '- User Levels').up()
                    .e("description", community.description).up()
                    .e("icon").up()
                    .e("icon_3ds").up()
                    .e("pid").up()
                    .e("app_data", 'TVZNSQE').up()
                    .e("is_user_community", 0).up()
                .up()
            .up();
        return xml.end({ pretty: true, allowEmpty: true });
    }
    /*  TODO Again, some constants */
    static async SinglePostResponse(post) {
        let xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up()
            .e("post");
        if (post.app_data) {
            xml = xml.e("app_data", post.app_data).up();
        }
        xml = xml.e("body", post.body).up()
            .e("community_id", post.community_id).up()
            .e("country_id", "254").up()
            .e("created_at", post.created_at).up()
            .e("feeling_id", "1").up()
            .e("id", post.id).up()
            .e("is_autopost", "0").up()
            .e("is_community_private_autopost", "0").up()
            .e("is_spoiler", "0").up()
            .e("is_app_jumpable", "0").up()
            .e("empathy_count", post.empathy_count).up()
            .e("language_id", "1").up()
            .e("number", "0").up();
        if (post.painting) {
            xml = xml.e("painting")
                .e("format", "tga").up()
                .e("content", post.painting).up()
                .e("size", post.painting.length).up()
                .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                .up();
        }
        xml = xml.e("pid", post.pid).up()
            .e("platform_id", "1").up()
            .e("region_id", "4").up()
            .e("reply_count", "0").up()
            .e("screen_name", post.screen_name).up()
            .e("title_id", post.title_id).up()
            .up();
        return xml.end({ pretty: true, allowEmpty: true });
    }
}

if (typeof module !== "undefined") {
    module.exports = CommunityPostGen;
}
