import createClient from "ipfs-http-client";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ipfsOnlyHash = require("ipfs-only-hash");

export const ipfsBaseUrl = "ipfs://";
export const ipfsHttpsBaseUrl = "https://ipfs.io/ipfs/";

export const ipfs = createClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export const metadataToIpfsCid = async (metadata: any) => {
  const canonicalizeMetadataBuffer = Buffer.from(JSON.stringify(metadata));
  const cid = await ipfsOnlyHash.of(canonicalizeMetadataBuffer);
  return cid;
};
