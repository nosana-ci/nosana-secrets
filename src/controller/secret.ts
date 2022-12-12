import { Context } from 'koa';
import Keyv from 'keyv';
import config from '../generic/config';

const makeConnection = (address: string): Keyv => {
  let storage: Keyv;
  if (config.storageConnection.includes('docdb.amazonaws.com')) {
    storage = new Keyv(config.storageConnection, {
      namespace: address,
      tlsCAFile: '/app/rds-combined-ca-bundle.pem',
    });
  } else {
    storage = new Keyv(config.storageConnection, {
      namespace: address,
    });
  }
  return storage;
};

export default {
  setSecrets: async (ctx: Context): Promise<void> => {
    const { secrets } = ctx.request.body;
    const { user } = ctx.state;
    const address = user.address;
    const storage = makeConnection(address);

    for (const key in secrets) {
      console.log(`storing secret for ${address}.${key}`);
      await storage.set(key, secrets[key]);
    }

    ctx.ok();
  },
  getSecrets: async (ctx: Context): Promise<void> => {
    const { user } = ctx.state;
    let userAddress = user.userAddress;
    const secretKeys: string[] = user.secrets;
    let retrieveAllSecrets = false;
    if (!userAddress) {
      // retrieve all your own secrets
      userAddress = user.address;
      retrieveAllSecrets = true;
    }
    const storage = makeConnection(userAddress);

    console.log(
      `${user.address} is requesting ${
        retrieveAllSecrets ? 'all' : JSON.stringify(secretKeys)
      } secrets for ${userAddress}`
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const secrets: { [key: string]: any } = {};
    if (retrieveAllSecrets) {
      for await (const [key, value] of storage.iterator()) {
        secrets[key] = value;
      }
    } else {
      for (let i = 0; i < secretKeys.length; i++) {
        secrets[secretKeys[i]] = await storage.get(secretKeys[i]);
      }
    }

    ctx.ok(secrets);
  },
  deleteSecret: async (ctx: Context): Promise<void> => {
    const { user } = ctx.state;
    const { key } = ctx.request.body;
    const storage: Keyv = makeConnection(user.address);

    console.log('Deleting key...', key);
    await storage.delete(key);
    console.log('Deleted!', key);

    ctx.ok();
  },
};
