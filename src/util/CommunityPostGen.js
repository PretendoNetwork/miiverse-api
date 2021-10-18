const xmlbuilder = require("xmlbuilder");
const moment = require("moment");
const database = require('../database');

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
                .e("community_id", community.id).up()
                .e("country_id", "254").up()
                .e("created_at", moment(posts[i].created_at).format("YYYY-MM-DD hh:mm:ss")).up()
                .e("feeling_id", "1").up()
                .e("id", posts[i].id).up()
                .e("is_autopost", "0").up()
                .e("is_community_private_autopost", "0").up()
                .e("is_spoiler", "0").up()
                .e("is_app_jumpable", "0").up()
                .e("empathy_count", posts[i].empathy_count).up()
                .e("language_id", "1").up()
                .e("number", "0").up();
            if (posts[i].painting) {
                xml = xml.e("painting")
                    .e("format", "tga").up()
                    .e("content", posts[i].painting).up()
                    .e("size", posts[i].painting.length).up()
                    .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                    .up();
            }
            xml = xml.e("pid", posts[i].pid).up()
                .e("platform_id", "1").up()
                .e("region_id", "4").up()
                .e("reply_count", "0").up()
                .e("screen_name", posts[i].screen_name).up()
                .e("title_id", community.title_ids[0]).up()
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
                .e("created_at", moment(posts[i].created_at).format('YYYY-MM-DD HH:MM:SS')).up()
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
            xml = xml.e("pid", posts[i].id).up()
                .e("platform_id", posts[i].platform_id).up()
                .e("region_id", posts[i].region_id).up()
                .e("reply_count", posts[i].reply_count).up()
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

    static async topics(communities) {
        const expirationDate = moment().add(2, 'days');
        let xml = xmlbuilder.create("result")
            .e("has_error", "0").up()
            .e("version", "1").up()
            .e("request_name", "topics").up()
            .e("expire", expirationDate.format('YYYY-MM-DD HH:MM:SS')).up()
            .e("topics");
        for (const community of communities) {
            let posts = await database.getPostsByCommunity(community, 30);
            xml = xml.e('topic')
                .e('empathy_count', community.empathy_count).up()
                .e('has_shop_page', community.has_shop_page).up()
                .e('icon', community.icon).up()
                .e('title_ids');
            community.title_ids.forEach(function (title_id) {
                xml = xml.e('title_id', title_id).up()
            })
            xml = xml.up()
                .e('title_id', community.title_ids[0]).up()
                .e('community_id', community.community_id).up()
                .e('is_recommended', community.is_recommended).up()
                .e('name', community.name).up()
                .e("people");
            for (const post of posts) {
                let newBody = '';
                if(post.body)
                    newBody = post.body.replace( /[\r\n]+/gm, '');
                xml = xml.e("person")
                    .e("posts")
                    .e("post")
                    .e("body", newBody).up()
                    .e("community_id", community.community_id).up()
                    .e("country_id", post.country_id).up()
                    .e("created_at", moment(post.created_at).format('YYYY-MM-DD HH:MM:SS')).up()
                    .e("feeling_id", post.feeling_id).up()
                    .e("id", post.id).up()
                    .e("is_autopost", post.is_autopost).up()
                    .e("is_community_private_autopost", post.is_community_private_autopost).up()
                    .e("is_spoiler", post.is_spoiler).up()
                    .e("is_app_jumpable", post.is_app_jumpable).up()
                    .e("empathy_count", post.empathy_count).up()
                    .e("language_id", post.language_id).up()
                    .e("mii", post.mii).up()
                    .e("mii_face_url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up();
                xml = xml.e("number", "0").up();
                if (post.painting) {
                    xml = xml.e("painting")
                        .e("format", "tga").up()
                        .e("content", post.painting.replace( /[\r\n]+/gm, "" )).up()
                        .e("size", post.painting.length).up()
                        .e("url", "https://s3.amazonaws.com/olv-public/pap/WVW69koebmETvBVqm1").up()
                        .up();
                }
                xml = xml.e("pid", post.pid).up()
                    .e("platform_id", post.platform_id).up()
                    .e("region_id", post.region_id).up()
                    .e("reply_count", post.reply_count).up()
                    .e("screen_name", post.screen_name).up()
                    .e("title_id", post.title_id).up()
                    .up().up().up();
            }
            xml = xml.up().up()
        }
        return xml.end({ pretty: true, allowEmpty: true });
    }
}

if (typeof module !== "undefined") {
    module.exports = CommunityPostGen;
}
