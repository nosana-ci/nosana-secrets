import config from '../generic/config';

import Keyv from 'keyv';

const makeConnection = (address: string) => {
  let storage;
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
  setSecrets: async (ctx: any) => {
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
  getSecrets: async (ctx: any) => {
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

    let secrets: { [key: string]: any } = {};
    if (retrieveAllSecrets) {
      for await (const [key, value] of storage.iterator()) {
        secrets[key] = value;
      }
    } else {
      secrets = await storage.get(secretKeys);
    }

    ctx.ok(secrets);
  },
  deleteSecret: async (ctx: any) => {
    const { user } = ctx.state;
    const { key } = ctx.request.body;
    const storage = makeConnection(user.address);

    console.log('Deleting key...', key);
    await storage.delete(key);
    console.log('Deleted!', key);

    ctx.ok();
  },
};
