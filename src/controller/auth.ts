const jwt = require('jsonwebtoken');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const anchor = require('@project-serum/anchor');
const { AnchorClient } = require('../services/solana');
const ipfs = require('../services/ipfs');
class FakeWallet {
  payer: any;
  constructor(payer: any) {
    this.payer = payer;
  }

  get publicKey() {
    return this.payer.publicKey;
  }
}

import { ValidationError } from '../generic/errors';

import config from '../generic/config';

async function generateJwtToken(address: any, userAddress: any, secrets: any) {
  const payload = {
    address,
    userAddress,
  };

  // some of the libraries and libraries written in other language,
  // expect base64 encoded secrets, so sign using the base64 to make
  // jwt useable across all platforms and languages.
  return jwt.sign({ ...payload }, config.auth.jwtSecret, {
    expiresIn: config.auth.tokenExpire,
  });
}

export default {
  payload: (ctx: { state: { user: any }; ok: (arg0: any) => void }) => {
    const { user } = ctx.state;

    ctx.ok(user);
  },
  generateJwtToken,
  login: async (ctx: any) => {
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
    let secrets;
    if (data.job) {
      const fakeWallet = new FakeWallet(anchor.web3.Keypair.generate());
      const anchorClient = new AnchorClient(fakeWallet);
      await anchorClient.setupAccounts();
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
      const hash = ipfs.solHashToIpfsHash(job.ipfsJob);
      const ipfsJob = await ipfs.retrieve(hash);
      secrets = ipfsJob.secrets;
    }

    const token = await generateJwtToken(data.address, userAddress, secrets);

    ctx.ok({ token });
  },
};
