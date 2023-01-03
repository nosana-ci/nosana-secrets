import jwt from 'jsonwebtoken';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import * as anchor from '@project-serum/anchor';
import { AnchorClient } from '../services/solana';
import ipfs from '../services/ipfs';
import { ValidationError } from '../generic/errors';
import config from '../generic/config';
import { Keypair } from '@solana/web3.js';
import { Context } from 'koa';

class FakeWallet {
  payer: Keypair;
  constructor(payer: Keypair) {
    this.payer = payer;
  }

  get publicKey() {
    return this.payer.publicKey;
  }
}

async function generateJwtToken(address: string, userAddress: string, secrets: string[]): Promise<string> {
  const payload = {
    address,
    userAddress,
    secrets,
  };

  // some of the libraries and libraries written in other language,
  // expect base64 encoded secrets, so sign using the base64 to make
  // jwt useable across all platforms and languages.
  return jwt.sign({ ...payload }, config.auth.jwtSecret, {
    expiresIn: config.auth.tokenExpire,
  });
}

export default {
  payload: (ctx: Context): void => {
    const { user } = ctx.state;

    ctx.ok(user);
  },
  generateJwtToken,
  login: async (ctx: Context): Promise<void> => {
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
      const fakeWallet = new FakeWallet(anchor.web3.Keypair.generate()) as unknown as Keypair;
      const anchorClient: AnchorClient = new AnchorClient(fakeWallet);
      await anchorClient.setupAccounts();
      const run = await anchorClient.fetchRunAccount(data.job);
      console.log('run', run);
      const job = await anchorClient.fetchJob(data.job);
      console.log('job', job);
      if (!job) {
        throw new ValidationError('Could not find job:' + data.job);
      }
      if (job.state >= 2) {
        throw new ValidationError('Job already finished:' + data.job);
      }
      if (run.account.node.toString() !== data.address) {
        throw new ValidationError('You did not claim this job:' + data.job);
      }
      userAddress = job.project;
      const hash = ipfs.solHashToIpfsHash(job.ipfsJob);
      console.log('retrieving ipfs json for hash', hash);
      const ipfsJob = await ipfs.retrieve(hash);
      console.log('ipfsJob', ipfsJob);
      secrets = ipfsJob.state['nosana/secrets'];
    }

    const token: string = await generateJwtToken(data.address, userAddress, secrets);

    ctx.ok({ token });
  },
};
