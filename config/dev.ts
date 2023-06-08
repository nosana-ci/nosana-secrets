const { STORAGE_CONNECTION, JWT_SECRET } = process.env;

export default {
  env: 'production',
  debug: false, // DEBUG || false,
  auth: {
    tokenExpire: '1h',
    jwtSecret: JWT_SECRET || 'nosana-jwt-secret',
  },
  storageConnection: STORAGE_CONNECTION || 'sqlite://db.sqlite',
  blockchain: {
    solanaNet: 'devnet',
    nosTokenProgramId: 'devr1BGQndEW5k5zfvG5FsLyZv1Ap73vNgAHcQ9sUVP',
    jobProgramId: 'nosJTmGQxvwXy23vng5UjkTbfv91Bzf9jEuro78dAGR',
    stakeProgramId: 'nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE',
    rewardsProgramId: 'nosRB8DUV67oLNrL45bo2pFLrmsWPiewe2Lk2DRNYCp',
  },
};
