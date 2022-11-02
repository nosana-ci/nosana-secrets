const jwt = require('jsonwebtoken');
const bs58 = require('bs58');
const nacl = require('tweetnacl');

const {
    ValidationError,
    ForbiddenError
} = require('../generic/errors');

const config = require('../generic/config');

const { privateCert } = config.keys;

async function generateJwtToken(address) {
    var payload = {
        address
    };

    // some of the libraries and libraries written in other language,
    // expect base64 encoded secrets, so sign using the base64 to make
    // jwt useable across all platforms and languages.
    return jwt.sign({ ...payload }, privateCert,
        {
            algorithm: 'RS256',
            expiresIn: config.auth.tokenExpire
        });
}

module.exports = {
    payload: ctx => {
        const { user } = ctx.state;

        ctx.ok(user);
    },
    generateJwtToken,
    login: async ctx => {
        const data = ctx.request.body;
        if (!data.address || !data.signature || !data.timestamp) {
            throw new ValidationError('address/signature/timestamp missing');
        }
        // Check if timestamp is within 60 seconds
        if (Math.abs(Math.floor(+new Date() / 1000) - data.timestamp) > 60) {
            throw new ValidationError('timestamp expired');
        }

        let address;
        const message = new TextEncoder().encode('nosana_secret_' + data.timestamp);
        if (!nacl.sign.detached.verify(
            message, new Uint8Array(data.signature.data), new Uint8Array(data.address.data))) {
            throw new ValidationError('invalid signature');
        }
        address = bs58.encode(new Uint8Array(data.address.data));

        const token = await generateJwtToken(address);

        ctx.ok({ token });
    }
};
