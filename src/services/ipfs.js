const axios = require('axios');
const bs58 = require('bs58');

module.exports = {
  solHashToIpfsHash: function (hashArray) {
    // Convert the ipfs bytes from a solana job to a CID
    // It prepends the 0x1220 (18,32) to make it 34 bytes and Base58 encodes it.
    // This result is IPFS addressable.
    hashArray.unshift(18, 32);
    return bs58.encode(Buffer.from(hashArray));
  },
  retrieve: async function (hash) {
    const response = await axios.get('https://nosana.mypinata.cloud/ipfs/' + hash);
    return response.data;
  }
};