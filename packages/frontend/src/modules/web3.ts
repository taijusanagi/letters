import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { abi as lettersAbi } from "../../../contracts/artifacts/contracts/Letters.sol/Letters.json";
import chainIdConfig from "../../../contracts/chainIds.json";
import { NetworkName, ChainId } from "../../../contracts/helpers/types";
import networkConfig from "../../../contracts/networks.json";
import { Letters } from "../../../contracts/typechain";

export const chainIdLabels =
  process.env.NODE_ENV == "development"
    ? ["Rinkeby", "BSC", "Matic", "Mainnet", "Local"]
    : ["Rinkeby", "BSC", "Matic", "Mainnet"];

export const chainIdValues =
  process.env.NODE_ENV == "development" ? ["4", "56", "137", "1", "31337"] : ["4", "56", "137", "1"];

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "95f65ab099894076814e8526f52c9149",
    },
  },
};

export const web3Modal = new Web3Modal({
  providerOptions,
});

export const initializeWeb3Modal = async () => {
  const web3ModalProvider = await web3Modal.connect();
  await web3ModalProvider.enable();
  return web3ModalProvider;
};

export const clearWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
};

export const getEthersSigner = async (provider: any) => {
  const web3EthersProvider = new ethers.providers.Web3Provider(provider);
  return web3EthersProvider.getSigner();
};

// this is only used for signing because torus wallet sign fails for ethers
export const getWeb3 = async (provider: any) => {
  return new Web3(provider);
};

export const getNetworkNameFromChainId = (chainId: ChainId): NetworkName => {
  return chainIdConfig[chainId] as NetworkName;
};

export const getContractsForChainId = (chainId: ChainId) => {
  const networkName = getNetworkNameFromChainId(chainId);
  const { letters, rpc, explore } = networkConfig[networkName];
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const lettersContract = new ethers.Contract(letters, lettersAbi, provider) as Letters;
  return { lettersContract, explore, provider };
};
