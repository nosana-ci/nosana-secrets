import axios from "axios";
import bs58 from "bs58";

export default {
  solHashToIpfsHash: function (hashArray: any) {
    // Convert the ipfs bytes from a solana job to a CID
    // It prepends the 0x1220 (18,32) to make it 34 bytes and Base58 encodes it.
    // This result is IPFS addressable.
    hashArray.unshift(18, 32);
    return bs58.encode(Buffer.from(hashArray));
  },
  retrieve: async function (hash: string) {
    const response = await axios.get(
      "https://nosana.mypinata.cloud/ipfs/" + hash
    );
    return response.data;
  },
};
