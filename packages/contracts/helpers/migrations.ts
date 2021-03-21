import * as fs from "fs";
import * as path from "path";
import hre, { ethers } from "hardhat";

import networks from "../networks.json";
import { CONTRACT_NAME, CONTRACT_SYMBOL } from "./constants";
import { NetworkName } from "./types";

export const filePath = "../networks.json";
export const networkName = hre.network.name == "hardhat" ? "localhost" : <NetworkName>hre.network.name;
export const gasPrice = process.env.GAS_PRICE ? parseInt(process.env.GAS_PRICE) : networks[networkName].defaultGasPrice; //10 gwei

export const updateJson = (contractName: string, address: string) => {
  const contractNameLowerString = contractName.toLowerCase();
  networkName != "localhost" && console.log("json update for", contractNameLowerString);
  networks[networkName][contractNameLowerString] = address;
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(networks));
  networkName != "localhost" && console.log("json updated");
};

export const deployLetters = async () => {
  const contractName = "Letters";
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(CONTRACT_NAME, CONTRACT_SYMBOL, { gasPrice });
  networkName != "localhost" && console.log(contractName, "deployed at", contract.address);
  updateJson(contractName, contract.address);
  return contract;
};
