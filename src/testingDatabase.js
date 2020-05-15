const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const fs = require('fs-extra');
const config = require('./config.json');
let B64token = 'C9EFfkLjs6/81whPNBXOEqDPGQiDykCDwS/B4KcQDcAJxyvnXEure4xfwS/GPQKbRqLoE/QCTPEHh2q9B6TgdWJYNvnNb3wpvwhHy5CJ0hqwYxVaKE0iZcxQVK7QyJlhya3sE3K0HTmP1DqVISxYkEyCF7ofSZMoRcbKUvxfYHbALnh+Hbdl5F3nEUIcmBPijsVzi8kJSe2aQYR8n1X3b0J0HFO5QzHAwMiwiZBOyHnIdHtpsoWalDDkjoQfufSP8LcNFA==';
let token = Buffer.from(B64token, 'base64');
console.log(B64token);
console.log(config.secret);
const cryptoPath = `${__dirname}/certs/access`;

const cryptoOptions = {
    private_key: fs.readFileSync(`${cryptoPath}/private.pem`),
    hmac_secret: config.secret
};

const privateKey = new NodeRSA(cryptoOptions.private_key, 'pkcs1-private-pem', {
    environment: 'browser',
    encryptionScheme: {
        'hash': 'sha256',
    }
});

const cryptoConfig = token.subarray(0, 0x90);
const signature = token.subarray(0x90, 0xA4);
const encryptedBody = token.subarray(0xA4);

const encryptedAESKey = cryptoConfig.subarray(0, 128);
const iv = cryptoConfig.subarray(128);

const decryptedAESKey = privateKey.decrypt(encryptedAESKey);

const decipher = crypto.createDecipheriv('aes-128-cbc', decryptedAESKey, iv);

let decryptedBody = decipher.update(encryptedBody);
decryptedBody = Buffer.concat([decryptedBody, decipher.final()]);
const hmac = crypto.createHmac('sha1', cryptoOptions.hmac_secret).update(decryptedBody);

const calculatedSignature = hmac.digest();
console.log(calculatedSignature);
console.log(signature);
//calculatedSignature is different than signature on ubuntu
//but is the same on Windows?????
//node wtf
if (!calculatedSignature.equals(signature)) {
    console.log('Token signature did not match');
    console.log("fuck");
}
