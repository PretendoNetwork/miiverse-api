const crypto = require('crypto');
const NodeRSA = require('node-rsa');
const fs = require('fs-extra');
const config = require('./config.json');
const util = require('./util/authentication');
const database = require('./database');

let b = "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" +
    "AAAA5vgbwDsbNA==";

console.log(util.data.processServiceToken('Lg8Ix5uzYLZ01ip/P3UMt4iEPVjJYjh41L5r+hndp30gzEGxgvx830MWvH7jhiNBIvJbCAwHSEKJF2RvHYL+xq3oCVON8e1yy/eZlWKKW3SOvVMRiXlEr66zPMqZSIIxtYLvn1+7MM3qJPIuTIzR/4/JGeAE6KxPJuFK7zkROEYu9LSfPKGY0O2Sv6rnrZze3NHwHtT70uI7FXbP0P3t8yVQLgtAbxktcS5+NeGSwpVwpnO54rMMZjgJ7l42VKPGhEzHBw=='));
/*let B64token = 'C9EFfkLjs6/81whPNBXOEqDPGQiDykCDwS/B4KcQDcAJxyvnXEure4xfwS/GPQKbRqLoE/QCTPEHh2q9B6TgdWJYNvnNb3wpvwhHy5CJ0hqwYxVaKE0iZcxQVK7QyJlhya3sE3K0HTmP1DqVISxYkEyCF7ofSZMoRcbKUvxfYHbALnh+Hbdl5F3nEUIcmBPijsVzi8kJSe2aQYR8n1X3b0J0HFO5QzHAwMiwiZBOyHnIdHtpsoWalDDkjoQfufSP8LcNFA==';
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
*/
database.connect().then(async e => {
    console.log('running');
    console.log(await util.data.processUser(1566682802));
});
