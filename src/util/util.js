const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const fs = require('fs-extra');
const database = require('../database');
const logger = require('../logger');
const grpc = require('nice-grpc');
const grpcServices = require('grpc');
const config = require('../../config.json');
const { SETTINGS } = require('../models/settings');
const { CONTENT } = require('../models/content');
const { NOTIFICATIONS } = require('../models/notifications');
const { FriendsDefinition } = grpcServices.friends.service;
const TGA = require('tga');
const pako = require('pako');
const PNG = require('pngjs').PNG;
const bmp = require("bmp-js");
const aws = require('aws-sdk');
const { ip, port, api_key } = config.grpc.friends;

const channel = grpc.createChannel(`${ip}:${port}`);
const client = grpc.createClient(FriendsDefinition, channel);

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.aws.spaces.key,
    secretAccessKey: config.aws.spaces.secret
});

async function saveNotification(pid, type, title, content, reference_id, link) {
    let notification = {
        pid: pid,
        type: type,
        title: title,
        content: content,
        reference_id: reference_id,
        link: link,
    }
    let newNotification = new NOTIFICATIONS(notification);
    return await newNotification.save();
}

let methods = {
    create_user: async function(pid, experience, notifications, region) {
        const pnid = await database.getPNID(pid);
        if(!pnid)
            return;
        let newSettings = {
            pid: pid,
            screen_name: pnid.mii.name,
            game_skill: experience,
            receive_notifications: notifications,
        }
        let newContent = {
            pid: pid
        }
        const newSettingsObj = new SETTINGS(newSettings);
        await newSettingsObj.save();

        const newContentObj = new CONTENT(newContent);
        await newContentObj.save();
    },
    decodeParamPack: function (paramPack) {
        /*  Decode base64 */
        let dec = Buffer.from(paramPack, "base64").toString("ascii");
        /*  Remove starting and ending '/', split into array */
        dec = dec.slice(1, -1).split("\\");
        /*  Parameters are in the format [name, val, name, val]. Copy into out{}. */
        const out = {};
        for (let i = 0; i < dec.length; i += 2) {
            out[dec[i].trim()] = dec[i + 1].trim();
        }
        return out;
    },
    processServiceToken: function(token) {
        try
        {
            let B64token = Buffer.from(token, 'base64');
            let decryptedToken = this.decryptToken(B64token);
            return decryptedToken.readUInt32LE(0x2);
        }
        catch(e)
        {
            return null;
        }

    },
    decryptToken: function(token) {
        // Access and refresh tokens use a different format since they must be much smaller
        // Assume a small length means access or refresh token
        if (token.length <= 32) {
            const cryptoPath = `${__dirname}/../certs/access`;
            const aesKey = Buffer.from(fs.readFileSync(`${cryptoPath}/aes.key`, { encoding: 'utf8' }), 'hex');

            const iv = Buffer.alloc(16);

            const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, iv);

            let decryptedBody = decipher.update(token);
            decryptedBody = Buffer.concat([decryptedBody, decipher.final()]);

            return decryptedBody;
        }

        const cryptoPath = `${__dirname}/../certs/access`;

        const cryptoOptions = {
            private_key: fs.readFileSync(`${cryptoPath}/private.pem`),
            hmac_secret: config.account_server_secret
        };

        const privateKey = new NodeRSA(cryptoOptions.private_key, 'pkcs1-private-pem', {
            environment: 'browser',
            encryptionScheme: {
                'hash': 'sha256',
            }
        });

        const cryptoConfig = token.subarray(0, 0x82);
        const signature = token.subarray(0x82, 0x96);
        const encryptedBody = token.subarray(0x96);

        const encryptedAESKey = cryptoConfig.subarray(0, 128);
        const point1 = cryptoConfig.readInt8(0x80);
        const point2 = cryptoConfig.readInt8(0x81);

        const iv = Buffer.concat([
            Buffer.from(encryptedAESKey.subarray(point1, point1 + 8)),
            Buffer.from(encryptedAESKey.subarray(point2, point2 + 8))
        ]);

        try {
            const decryptedAESKey = privateKey.decrypt(encryptedAESKey);

            const decipher = crypto.createDecipheriv('aes-128-cbc', decryptedAESKey, iv);

            let decryptedBody = decipher.update(encryptedBody);
            decryptedBody = Buffer.concat([decryptedBody, decipher.final()]);

            const hmac = crypto.createHmac('sha1', cryptoOptions.hmac_secret).update(decryptedBody);
            const calculatedSignature = hmac.digest();

            if (Buffer.compare(calculatedSignature, signature) !== 0) {
                logger.error('Token signature did not match');
                return null;
            }

            return decryptedBody;
        }
        catch (e) {
            logger.error('Failed to decrypt token. Probably a NNID from the topics request');
            return null;
        }
    },
    processPainting: async function (painting, isTGA) {
        if (isTGA) {
            let paintingBuffer = Buffer.from(painting, 'base64');
            let output = '';
            try {
                output = pako.inflate(paintingBuffer);
            } catch (err) {
                console.error(err);
            }
            let tga = new TGA(Buffer.from(output));
            let png = new PNG({
                width: tga.width,
                height: tga.height
            });
            png.data = tga.pixels;
            return PNG.sync.write(png);
            //return `data:image/png;base64,${pngBuffer.toString('base64')}`;
        }
        else {
            let paintingBuffer = Buffer.from(painting, 'base64');
            let bitmap = bmp.decode(paintingBuffer)
            const tga = this.createBMPTgaBuffer(bitmap.width, bitmap.height, bitmap.data, false);

            let output;
            try
            {
                output = pako.deflate(tga, {level: 6});
            }
            catch (err)
            {
                console.error(err);
            }

            return new Buffer(output).toString('base64')
        }
    },
    nintendoPasswordHash: function(password, pid) {
        const pidBuffer = Buffer.alloc(4);
        pidBuffer.writeUInt32LE(pid);

        const unpacked = Buffer.concat([
            pidBuffer,
            Buffer.from('\x02\x65\x43\x46'),
            Buffer.from(password)
        ]);
        return crypto.createHash('sha256').update(unpacked).digest().toString('hex');
    },
    resizeImage: function (file, width, height) {
        sharp(file)
            .resize({ height: height, width: width })
            .toBuffer()
            .then(data => {
                return data;
            });
    },
    createBMPTgaBuffer: function(width, height, pixels, dontFlipY) {
        var buffer = Buffer.alloc(18 + pixels.length);
        // write header
        buffer.writeInt8(0, 0);
        buffer.writeInt8(0, 1);
        buffer.writeInt8(2, 2);
        buffer.writeInt16LE(0, 3);
        buffer.writeInt16LE(0, 5);
        buffer.writeInt8(0, 7);
        buffer.writeInt16LE(0, 8);
        buffer.writeInt16LE(0, 10);
        buffer.writeInt16LE(width, 12);
        buffer.writeInt16LE(height, 14);
        buffer.writeInt8(32, 16);
        buffer.writeInt8(8, 17);

        var offset = 18;
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                var idx = ((dontFlipY ? i : height - i - 1) * width + j) * 4;
                buffer.writeUInt8(pixels[idx + 1], offset++);    // b
                buffer.writeUInt8(pixels[idx + 2], offset++);    // g
                buffer.writeUInt8(pixels[idx + 3], offset++);    // r
                buffer.writeUInt8(255, offset++);          // a
            }
        }

        return buffer;
    },
    uploadCDNAsset: async function(bucket, key, data, acl) {
        const awsPutParams = {
            Body: data,
            Key: key,
            Bucket: bucket,
            ACL: acl
        };

        await s3.putObject(awsPutParams).promise();
    },
    newNotification: async function(pid, type, reference_id, origin_pid, title, content) {
        let user = await database.getUserSettings(origin_pid);
        /**
         * 0 like
         * 1 reply
         * 2 new follower
         * 3 other
         */

        if(type === 1)
            return await saveNotification(pid, type, `${user.screen_name} Replied to your post.`, content, reference_id, `/posts/${reference_id}`);
        else if(type === 2)
            return await saveNotification(pid, type, `${user.screen_name} Followed you!`, '', reference_id, `/users/show?pid=${origin_pid}`);

        let lastNotification = await database.getLastNotification(pid);
        if(lastNotification && lastNotification.type === 0 && lastNotification.reference_id === reference_id) {
            let post = await database.getPostByID(reference_id);
            let newTitle = '';
            switch (post.empathy_count) {
                case 1:
                    newTitle = `${user.screen_name} Yeahed your post!`;
                    break;
                case 2:
                    newTitle = `${user.screen_name} and 1 other Yeahed your post!`;
                    break;
                default:
                    newTitle = `${user.screen_name} and ${post.empathy_count - 1} others Yeahed your post!`;
                    break;
            }
            lastNotification.title = newTitle;
            await lastNotification.save();
        }
        else if(type === 0) {
            let post = await database.getPostByID(reference_id);
            let newTitle = '';
            switch (post.empathy_count) {
                case 1:
                    newTitle = `${user.screen_name} Yeahed your post!`;
                    break;
                case 2:
                    newTitle = `${user.screen_name} and 1 other Yeahed your post!`;
                    break;
                default:
                    newTitle = `${user.screen_name} and ${post.empathy_count - 1} others Yeahed your post!`;
                    break;
            }
            let newContent;
            if(!post.body) {
                if(post.screenshot)
                    newContent = 'Screenshot Post';
                else if(post.painting)
                    newContent = 'Drawing Post';
            }
            else
                newContent = post.body;
            return await saveNotification(pid, type, newTitle, newContent, reference_id, `/posts/${post.id}`);
        }
        else
            return await saveNotification(pid, type, title, content, reference_id, '');

    },
    getFriends: async function(pid) {
        return await client.getUserFriendPIDs({
            pid: pid
        }, {
            metadata: grpc.Metadata({
                'X-API-Key': api_key
            })
        });
    }
};
module.exports = methods;
