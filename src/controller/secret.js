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
        const { user } = ctx.state;
        let userAddress = user.userAddress;
        let secrets = user.secrets;
        if (!userAddress) {
            // retrieve all your own secrets
            userAddress = user.address;
            try {
                delete require.cache[require.resolve(`../../secrets/${userAddress}.json`)];
                secrets = Object.keys(require(`../../secrets/${userAddress}.json`));
            } catch (err) {
                // no secrets yet, so return empty object
                return ctx.ok({});
            }
        }        
        let fileStore;
        try {
            fileStore = new KevastFile(`./secrets/${userAddress}.json`);
        } catch (err) {
            // no secrets yet, so return empty object
            return ctx.ok({});
        }

        const kevast = new Kevast(fileStore);
        kevast.use(new KevastEncrypt(config.encryptionKey));
        decryptedSecrets = {};
        for (let i = 0; i < secrets.length; i++) {
            console.log(`decrypting secret for ${userAddress}.${secrets[i]}`);
            try {
                decryptedSecrets[secrets[i]] = await kevast.get(secrets[i]);
            } catch (e) {
                console.error(`Could not decrypt ${secrets[i]}`, e);
            }
        }

        ctx.ok(decryptedSecrets);
    },
    deleteSecret: async ctx => {
        const { user } = ctx.state;
        const { key } = ctx.request.body;
        const fileStore = new KevastFile(`./secrets/${user.address}.json`);
        const kevast = new Kevast(fileStore);
        await kevast.remove(key);
        ctx.ok();
    }
};
