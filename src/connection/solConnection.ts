import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Network } from "../lib/types";

const createConnection = () => {
  const chain =
  process.env.NODE_ENV === "development" ? Network.DEVNET : Network.MAINNET;
  return new Connection(clusterApiUrl(chain), "confirmed");
};

declare global {
  var solConnection: Connection | undefined;
}

const solConnection = globalThis.solConnection ?? createConnection();

if (process.env.NODE_ENV !== "production") {
  globalThis.solConnection = solConnection;
}

export default solConnection;
