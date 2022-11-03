const config = require('../generic/config');
const { Kevast } = require('kevast');
const { KevastFile } = require('kevast-file');
const { KevastEncrypt } = require('kevast-encrypt');

const {
    ValidationError,
    NotFoundError
} = require('../generic/errors');

module.exports = {
    getSecrets: async ctx => {
        const { secrets } = ctx.request.body;
        const { user } = ctx.state;
        const userAddress = user.userAddress;
        // const secrets = ['key'];
        // const userAddress = 'test';
        const fileStore = new KevastFile(`./secrets/${userAddress}.json`);
        const kevast = new Kevast(fileStore);
        kevast.use(new KevastEncrypt(config.encryptionKey));
        decryptedSecrets = {};
        for (let i = 0; i < secrets.length; i++) {
            console.log(`decrypting secret for ${userAddress}.${secrets[i]}`);
            decryptedSecrets[secrets[i]] = await kevast.get(secrets[i]);
        }

        ctx.ok(decryptedSecrets);
    },

};
