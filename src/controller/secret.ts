import config from "../generic/config";

import Keyv from "keyv";

export default {
  setSecrets: async (ctx: any) => {
    const { secrets } = ctx.request.body;
    const { user } = ctx.state;
    const address = user.address;
    let storage;
    if (config.storageConnection.includes("docdb.amazonaws.com")) {
      storage = new Keyv(config.storageConnection, {
        namespace: address,
        ssl: true,
        sslValidate: true,
        sslCA: "/app/rds-combined-ca-bundle.pem",
      });
    } else {
      storage = new Keyv(config.storageConnection, {
        namespace: address,
      });
    }

    for (const key in secrets) {
      console.log(`storing secret for ${address}.${key}`);
      await storage.set(key, secrets[key]);
    }

    ctx.ok();
  },
  getSecrets: async (ctx: any) => {
    const { user } = ctx.state;
    let userAddress = user.userAddress;
    let secretKeys: string[] = user.secrets;
    let retrieveAllSecrets = false;
    if (!userAddress) {
      // retrieve all your own secrets
      userAddress = user.address;
      retrieveAllSecrets = true;
    }
    let storage;
    if (config.storageConnection.includes("docdb.amazonaws.com")) {
      storage = new Keyv(config.storageConnection, {
        namespace: userAddress,
        ssl: true,
        sslValidate: true,
        sslCA: "/app/rds-combined-ca-bundle.pem",
      });
    } else {
      storage = new Keyv(config.storageConnection, {
        namespace: userAddress,
      });
    }
    const secrets: { [key: string]: any } = {};
    if (retrieveAllSecrets) {
      for await (const [key, value] of storage.iterator()) {
        secrets[key] = value;
      }
    } else {
      for (let i = 0; i < secretKeys.length; i++) {
        console.log(`retrieiving secret for ${userAddress}.${secretKeys[i]}`);
        try {
          secrets[secretKeys[i]] = await storage.get(secretKeys[i]);
        } catch (e) {
          console.error(`Could not retrieve ${secretKeys[i]}`, e);
        }
      }
    }

    ctx.ok(secrets);
  },
  deleteSecret: async (ctx: any) => {
    const { user } = ctx.state;
    const { key } = ctx.request.body;
    const storage = new Keyv(config.storageConnection, {
      namespace: user.address,
    });

    await storage.delete(key);
    ctx.ok();
  },
};
