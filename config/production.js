const {
    ENCRYPTION_KEY
} = process.env;

module.exports = {
    env: 'production',
    debug: false, // DEBUG || false,
    auth: {
        tokenExpire: '10h'
    },
    encryptionKey: ENCRYPTION_KEY,
    blockchain: {
        solanaNet: 'https://lively-sparkling-shape.solana-mainnet.discover.quiknode.pro/515f35af4d64f05ab7b10cd8cd88f34f9d1ec7d0',
        nosTokenProgramId: 'nosXBVoaCTtYdLvKY6Csb4AC8JCdQKKAaWYtx2ZMoo7',
        jobProgramId: 'nosJhNRqr2bc9g1nfGDcXXTXvYUmxD4cVwy2pMWhrYM',
        stakeProgramId: 'nosScmHY2uR24Zh751PmGj9ww9QRNHewh9H59AfrTJE',
        rewardsProgramId: 'nosRB8DUV67oLNrL45bo2pFLrmsWPiewe2Lk2DRNYCp'
    }
};
