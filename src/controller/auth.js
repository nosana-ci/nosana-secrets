const jwt = require('jsonwebtoken');
const db = require('../services/database');
const uuid = require('uuid').v4;
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const { Keypair } = require('@solana/web3.js');

const {
    ValidationError,
    ForbiddenError
} = require('../generic/errors');

const config = require('../generic/config');

const { privateCert } = config.keys;

async function generateJwtToken(user) {
    var payload = {
        id: user.id,
        address: user.address,
        roles: user.roles ? user.roles.split(',') : []
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

        let user_address;
        let loginUser;
        const message = new TextEncoder().encode('nosana_' + data.timestamp);
        if (!nacl.sign.detached.verify(
            message, new Uint8Array(data.signature.data), new Uint8Array(data.address.data))) {
            throw new ValidationError('invalid signature');
        }
        user_address = bs58.encode(new Uint8Array(data.address.data));
        loginUser = await db('user')
            .first()
            .where({ address: user_address });

        if (!loginUser) {
            const keypair = Keypair.generate();
            let newUser = {
                address: user_address,
                generated_address: keypair.publicKey.toString(),
                private_key: bs58.encode(keypair.secretKey)
            };
            newUser.id = uuid();
            try {
                await db('user').insert(newUser);
                await db('project').insert({user_id: newUser.id});
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes('user_address_unique'))
                        throw new ValidationError({ address: 'User already exists' });
                }
                throw err;
            }

            loginUser = await db('user')
                .first()
                .where({ address: newUser.address });
        }


        if (loginUser.status !== 'ACTIVE') {
            throw new ForbiddenError('Your account is not active');
        }

        const token = await generateJwtToken(loginUser);

        ctx.ok({ token });
    }
};
