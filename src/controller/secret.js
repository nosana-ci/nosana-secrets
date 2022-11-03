const config = require('../generic/config');
const { Kevast } = require('kevast');
const { KevastFile } = require('kevast-file');
const { KevastEncrypt } = require('kevast-encrypt');

const {
    ValidationError,
    NotFoundError
} = require('../generic/errors');

module.exports = {
    setSecrets: async ctx => {
        const { secrets } = ctx.request.body;
        const { user } = ctx.state;
        const address = user.address;
        // const secrets = {'key': 'value'};
        // const address = 'test';
        const fileStore = new KevastFile(`./secrets/${address}.json`);
        const kevast = new Kevast(fileStore);
        kevast.use(new KevastEncrypt(config.encryptionKey));
        for (const key in secrets) {
            console.log(`storing secret for ${address}.${key}`);
            await kevast.set(key, secrets[key]);
        }

        ctx.ok();
    },
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
