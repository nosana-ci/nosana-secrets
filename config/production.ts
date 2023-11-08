const { STORAGE_CONNECTION, JWT_SECRET } = process.env;

export default {
  env: "production",
  debug: false, // DEBUG || false,
  auth: {
    tokenExpire: "1h",
    jwtSecret: JWT_SECRET
  },
  storageConnection: STORAGE_CONNECTION || "sqlite://db.sqlite",
  blockchain: {
    solanaNet:
      "https://rpc.hellomoon.io/853e30f5-383d-4cc6-a5ee-b5fb4c7a7178",
    nosTokenProgramId: "nosXBVoaCTtYdLvKY6Csb4AC8JCdQKKAaWYtx2ZMoo7",
    jobProgramId: "nosJhNRqr2bc9g1nfGDcXXTXvYUmxD4cVwy2pMWhrYM",
    stakeProgramId: "nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE",
    rewardsProgramId: "nosRB8DUV67oLNrL45bo2pFLrmsWPiewe2Lk2DRNYCp",
  },
};
