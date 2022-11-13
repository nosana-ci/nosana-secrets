const jwt = require('jsonwebtoken');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const anchor = require('@project-serum/anchor');
const { AnchorClient } = require('../services/solana');
class FakeWallet {
    constructor (payer) {
        this.payer = payer;
    }

    get publicKey () {
        return this.payer.publicKey;
    }
}

const {
    ValidationError,
    ForbiddenError
} = require('../generic/errors');

const config = require('../generic/config');

const { privateCert } = config.keys;

async function generateJwtToken(address, userAddress) {
    var payload = {
        address,
        userAddress
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

        const address_bytes = bs58.decode(data.address);
        const signature_bytes = bs58.decode(data.signature);
        const message = new TextEncoder().encode('nosana_secret_' + data.timestamp);
        if (!nacl.sign.detached.verify(message, signature_bytes, address_bytes)) {
            throw new ValidationError('invalid signature');
        }

        let userAddress;
        if (data.job) {
            const fakeWallet = new FakeWallet(anchor.web3.Keypair.generate());
            const anchorClient = await new AnchorClient(fakeWallet);
            const job = await anchorClient.fetchJob(data.job);
            if (!job) {
                throw new ValidationError('Could not find job:' + data.job);
            }
            if (job.state >= 2) {
                throw new ValidationError('Job already finished:' + data.job);
            }
            if (job.node.toString() !== data.address) {
                throw new ValidationError('You did not claim this job:' + data.job);
            }
            userAddress = job.project;
        }

        const token = await generateJwtToken(data.address, userAddress);

        ctx.ok({ token });
    }
};
