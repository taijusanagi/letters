import * as fs from "fs";
import * as path from "path";

import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import { CONTRACT_NAME, CONTRACT_SYMBOL } from "../helpers/constants";
import { deployLetters } from "../helpers/migrations";

chai.use(solidity);
const { expect } = chai;

describe("Letters", function () {
  let signer, to;
  let lettersContract;

  const letterString = "Hi.";
  const letterBytes32 = ethers.utils.formatBytes32String(letterString);
  const firstTokenId = 0;
  const lastTokenId = 16384;

  this.beforeEach("initialization.", async function () {
    [signer, to] = await ethers.getSigners();
    lettersContract = await deployLetters();
  });
  it("interface check", async function () {
    expect(await lettersContract.name()).to.equal(CONTRACT_NAME);
    expect(await lettersContract.symbol()).to.equal(CONTRACT_SYMBOL);
  });

  it("mint ", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    expect(await lettersContract.ownerOf(firstTokenId)).to.equal(to.address);
  });

  it("cannot mint same letter", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    await expect(lettersContract.sendLetter(to.address, letterBytes32)).to.revertedWith("letter has been sent");
  });

  it("cannot mint when receiver box is closed", async function () {
    await lettersContract.connect(to).closeReceiveBox();
    await expect(lettersContract.sendLetter(to.address, letterBytes32)).to.revertedWith("receive box closed");
  });

  it("cannot transfer when receiver box is closed", async function () {
    await lettersContract.sendLetter(signer.address, letterBytes32);
    await lettersContract.connect(to).closeReceiveBox();
    await expect(lettersContract.transferFrom(signer.address, to.address, firstTokenId)).to.revertedWith(
      "receive box closed"
    );
  });

  it("should able to receive after closing then opening", async function () {
    await lettersContract.connect(to).closeReceiveBox();
    await lettersContract.connect(to).openReceiveBox();
    await lettersContract.sendLetter(to.address, letterBytes32);
    expect(await lettersContract.ownerOf(firstTokenId)).to.equal(to.address);
  });

  it("getName", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    expect(await lettersContract.getName(firstTokenId)).to.equal(letterString);
  });

  it("getDescription", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    const expected = `32bytes from ${signer.address.toLowerCase()}`;
    expect(await lettersContract.getDescription(firstTokenId)).to.equal(expected);
  });

  // it("getMetadata", async function () {
  //   await lettersContract.sendLetter(to.address, letterBytes32);
  //   const name = await lettersContract.getName(firstTokenId);
  //   const description = await lettersContract.getDescription(firstTokenId);
  //   const image_data = await lettersContract.getImageData(firstTokenId);
  //   const expectedMetadata = {
  //     name,
  //     description,
  //     image_data,
  //   };
  //   const expected = JSON.stringify(expectedMetadata);
  //   expect(await lettersContract.getMetaData(firstTokenId)).to.equal(expected);
  // });

  it("tokenURI", async function () {
    await lettersContract.sendLetter(to.address, letterBytes32);
    // const name = await lettersContract.getName(firstTokenId);
    // const description = await lettersContract.getDescription(firstTokenId);
    // const image_data = await lettersContract.getImageData(firstTokenId);
    // const expectedMetadata = {
    //   name,
    //   description,
    //   image_data,
    // };
    // console.log(expectedMetadata);
    // const expected = JSON.stringify(expectedMetadata);
    // expect(await lettersContract.getMetaData(firstTokenId)).to.equal(expected);
    console.log(await lettersContract.tokenURI(firstTokenId));
  });

  // this is skiped for usual test because it takes too long to execute
  it.skip("cannot mint more than limit", async function () {
    for (let i = 0; i <= lastTokenId + 1; i++) {
      console.log(i);
      if (i <= lastTokenId) {
        const loopedLetterBytes = ethers.utils.formatBytes32String(i.toString());
        await lettersContract.sendLetter(to.address, loopedLetterBytes);
      } else {
        await expect(lettersContract.sendLetter(to.address, letterBytes32)).to.revertedWith(
          "all letters have been sent"
        );
      }
    }
  });
});
