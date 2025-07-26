import { ethers } from "ethers";

const createProvider = () => {
  const rpcUrl =
    process.env.NODE_ENV === "development"
      ? process.env.ETH_RPC_URL_DEV 
      : process.env.ETH_RPC_URL_MAINNET; 

  if (!rpcUrl) throw new Error("Missing Ethereum RPC URL");

  return new ethers.JsonRpcProvider(rpcUrl);
};

declare global {
  var ethProvider: ethers.JsonRpcProvider | undefined;
}

const ethProvider = globalThis.ethProvider ?? createProvider();

if (process.env.NODE_ENV !== "production") {
  globalThis.ethProvider = ethProvider;
}

export default ethProvider;
