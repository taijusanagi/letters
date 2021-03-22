import * as fs from "fs";
import * as path from "path";

import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { CONTRACT_NAME, CONTRACT_SYMBOL, OWNER_ADDRESS, FEE_BPS, LAST_TOKEN_ID } from "../helpers/constants";
import { deployLetters } from "../helpers/migrations";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const IPFSMini = require("ipfs-mini");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ipfsOnlyHash = require("ipfs-only-hash");
const ipfsMini = new IPFSMini({ host: "ipfs.infura.io", port: 5001, protocol: "https" });

chai.use(solidity);
const { expect } = chai;

describe("Letters", function () {
  let signer, to;
  let lettersContract;

  const letterString = "Letters.";
  const letterBytes32 = ethers.utils.formatBytes32String(letterString);
  const ownerTokenId = 0;
  const firstTokenId = 1;

  this.beforeEach("initialization.", async function () {
    [signer, to] = await ethers.getSigners();
    lettersContract = await deployLetters();
  });

  it("interface check", async function () {
    expect(await lettersContract.name()).to.equal(CONTRACT_NAME);
    expect(await lettersContract.symbol()).to.equal(CONTRACT_SYMBOL);
    expect(await lettersContract.getLetter(ownerTokenId)).to.equal(CONTRACT_NAME);
    expect(await lettersContract.ownerOf(ownerTokenId)).to.equal(OWNER_ADDRESS);
  });

  it("mint", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    expect(await lettersContract.ownerOf(firstTokenId)).to.equal(to.address);
  });

  it("getFeeBps", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const feeBps = await lettersContract.getFeeBps(firstTokenId);
    expect(feeBps[0]).to.equal(FEE_BPS[0]);
    expect(feeBps[1]).to.equal(FEE_BPS[1]);
  });

  it("getFeeRecipients", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const feeBps = await lettersContract.getFeeRecipients(firstTokenId);
    expect(feeBps[0]).to.equal(OWNER_ADDRESS);
    expect(feeBps[1]).to.equal(signer.address);
  });

  it("getLetter", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    expect(await lettersContract.getLetter(firstTokenId)).to.equal(letterString);
  });

  it("getDescription", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const expected = `just #${firstTokenId} 32 bytes letter from ${signer.address.toLowerCase()}`;
    expect(await lettersContract.getDescription(firstTokenId)).to.equal(expected);
  });

  it("getImageData", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const expected = fs.readFileSync(path.join(__dirname, "../sample.svg")).toString().trim();
    const rawResult = await lettersContract.getImageData(firstTokenId);
    const result = rawResult.replace(/\\/g, "");
    expect(result).to.equal(expected);
  });

  it("getMetadata", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const name = await lettersContract.getLetter(firstTokenId);
    const description = await lettersContract.getDescription(firstTokenId);
    const image_data = await lettersContract.getImageData(firstTokenId);
    const formated = image_data.replace(/\\/g, "");
    const expectedMetadata = {
      name,
      description,
      image_data: formated,
    };
    const expected = JSON.stringify(expectedMetadata);
    expect(await lettersContract.getMetaData(firstTokenId)).to.equal(expected);
  });

  it("getProvenance", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const metadata = await lettersContract.getMetaData(firstTokenId);
    const expected = ethers.utils.sha256(Buffer.from(metadata));
    expect(await lettersContract.getProvenance(firstTokenId)).to.equal(expected);
  });

  it("getCid", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const metadata = await lettersContract.getMetaData(firstTokenId);
    const cid = await ipfsOnlyHash.of(Buffer.from(metadata));
    expect(await lettersContract.getCid(firstTokenId)).to.equal(cid);
  });

  it("tokenURI", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const metadata = await lettersContract.getMetaData(firstTokenId);
    const cid = await ipfsOnlyHash.of(Buffer.from(metadata));
    expect(await lettersContract.tokenURI(firstTokenId)).to.equal(`ipfs://${cid}`);
  });

  // this is only used once to make sure supply limit is working
  it("cannot mint more than limit and provenence is correct", async function () {
    for (let i = 1; i <= LAST_TOKEN_ID; i++) {
      const loopedLetterBytes = ethers.utils.formatBytes32String(i.toString());
      await lettersContract.sendLetter(to.address, loopedLetterBytes);
      if (i == LAST_TOKEN_ID) {
        await expect(lettersContract.sendLetter(to.address, loopedLetterBytes)).to.revertedWith(
          "all letters have been sent"
        );
      }
    }
    let concatenated = await lettersContract.getProvenance(0);
    for (let i = 1; i <= LAST_TOKEN_ID; i++) {
      const provenence = await lettersContract.getProvenance(i);
      concatenated = ethers.utils.sha256(concatenated + provenence.substring(2, 66));
    }
    expect(await lettersContract.LETTERS_PROVENANCE()).to.equal(concatenated);
  });

  // this is only used once to upload content to ipfs
  it.skip("upload metadata to ipfs ", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const metadata = await lettersContract.getMetaData(firstTokenId);
    const cid = await ipfsMini.add(metadata);
    console.log(`ipfs://${cid}`);
  });
});
