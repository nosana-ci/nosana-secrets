const anchor = require('@project-serum/anchor');
const config = require('../generic/config');
const ENV = config.blockchain.solanaNet;
let node = ENV;
if (!node.includes('http')) {
    node = anchor.web3.clusterApiUrl(ENV);
}

const {
    ValidationError,
    NotFoundError
} = require('../generic/errors');

module.exports = {
    payload: ctx => {
        const { user } = ctx.state;

        ctx.ok(user);
    },
};
