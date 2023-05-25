import { Context } from 'koa';
import Keyv from 'keyv';
import config from '../generic/config';
import { ValidationError } from '../generic/errors';

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
    const { secrets, prefix } = ctx.request.body;
    const { user } = ctx.state;
    const address = user.address;
    const storage = makeConnection(address);

    for (const key in secrets) {
      let name = key;
      if (prefix) {
        name = prefix + name;
      }
      console.log(`storing secret for ${address}.${name}`);
      await storage.set(name, secrets[key]);
    }

    ctx.ok();
  },
  getSecret: async (ctx: Context): Promise<void> => {
    const { user } = ctx.state;
    const { key } = ctx.params;
    let userAddress = user.userAddress;
    const secretKeys: string[] = user.secrets;
    if (!userAddress) {
      // retrieve your own secrets
      userAddress = user.address;
    } else if (!secretKeys || !secretKeys.includes(key)) {
      throw new ValidationError(`secret key ${key} not in job`);
    }
    const storage = makeConnection(userAddress);

    console.log(`${user.address} is requesting ${key} secret for ${userAddress}`);

    const secret = await storage.get(key);

    ctx.ok(secret);
  },
  getSecrets: async (ctx: Context): Promise<void> => {
    const { user } = ctx.state;
    const { prefix } = ctx.request.query;
    let userAddress = user.userAddress;
    const secretKeys: string[] = user.secrets;
    let retrieveAllSecrets = false;
    if (!userAddress) {
      // retrieve all your own secrets
      userAddress = user.address;
      retrieveAllSecrets = true;
    } else if (!secretKeys) {
      throw new ValidationError('no secrets in job');
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
        if (!prefix || key.startsWith(prefix)) {
          secrets[key] = value;
        }
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
