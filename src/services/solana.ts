import * as anchor from '@project-serum/anchor';
import { sendAndConfirmRawTransaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import idl from './nosana_jobs';
import config from '../generic/config';
const ENV = config.blockchain.solanaNet;

let node = ENV;
if (!node.includes('http')) {
  node = anchor.web3.clusterApiUrl(ENV);
}

export class AnchorClient {
  rewardsProgramId?: anchor.web3.PublicKey;
  programId?: any;
  connection?: anchor.web3.Connection;
  provider?: anchor.AnchorProvider;
  program?: anchor.Program<any>;
  rewardsProgram?: anchor.Program<any>;
  accounts?: any;
  constructor(keypair: anchor.web3.Keypair) {
    console.log('initializing anchor client');
    this.rewardsProgramId = new anchor.web3.PublicKey(config.blockchain.rewardsProgramId);
    this.programId = config.blockchain.jobProgramId;
    this.connection = new anchor.web3.Connection(node);
    console.log('\n\nConnected to', node);

    let wallet;
    if (keypair) {
      wallet = new anchor.Wallet(keypair);
    }
    // maps anchor calls to Phantom direction
    this.provider = new anchor.AnchorProvider(this.connection, wallet, {});
    this.program = new anchor.Program(idl, this.programId, this.provider);
    this.rewardsProgram = new anchor.Program(idl, this.rewardsProgramId, this.provider);

    // setup accounts
    return this;
  }

  async setupAccounts?() {
    this.accounts = {
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      rewardsProgram: this.rewardsProgram.programId,

      mint: new anchor.web3.PublicKey(config.blockchain.nosTokenProgramId),
      vault: null,
      market: null,
      authority: null,
      feePayer: null,
      job: null,
      rewardsVault: null,
      user: null,
    };

    [this.accounts.rewardsVault] = await anchor.web3.PublicKey.findProgramAddress(
      [this.accounts.mint.toBuffer()],
      this.rewardsProgram.programId
    );
    [this.accounts.rewardsReflection] = await anchor.web3.PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode('reflection')],
      this.rewardsProgram.programId
    );

    return this;
  }

  async customSend?(tx: anchor.web3.Transaction, signers: any[], opts: any) {
    if (signers === undefined) {
      signers = [];
      tx.feePayer = this.provider.wallet.publicKey;
    } else {
      tx.feePayer = signers[1].publicKey;
    }
    if (opts === undefined) {
      opts = this.provider.opts;
    }
    tx.recentBlockhash = (await this.provider.connection.getLatestBlockhash(opts.preflightCommitment)).blockhash;
    await this.provider.wallet.signTransaction(tx);
    signers
      .filter((s: any) => s !== undefined)
      .forEach((kp: any) => {
        tx.partialSign(kp);
      });
    const rawTx = tx.serialize();
    const txId = await sendAndConfirmRawTransaction(this.provider.connection, rawTx, opts);
    return txId;
  }
  async fetchJob?(jobId: anchor.Address) {
    return await this.program.account.jobAccount.fetch(jobId);
  }
  async fetchRunAccount?(jobPublicKey: { toString: () => any }) {
    const res = (
      await this.program.account.runAccount.all([{ memcmp: { offset: 8, bytes: jobPublicKey.toString() } }])
    )[0];
    return res;
  }
  async getMarket?(marketId: anchor.Address) {
    return await this.program.account.marketAccount.fetch(marketId);
  }
  async getMarkets?() {
    return await this.program.account.marketAccount.all();
  }
}
