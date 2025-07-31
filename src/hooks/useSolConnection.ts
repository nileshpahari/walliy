import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { RootState } from "@/app/store";
import { Network } from "@/lib/types";

const useSolConnection = () => {
  const selectedNetwork: Network = useSelector(
    (state: RootState) => state.networks.selectedNetwork
  );

  const connection = useMemo(() => {
    switch (selectedNetwork) {
      case Network.MAINNET:
        return new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
      case Network.DEVNET:
        return new Connection(clusterApiUrl("devnet"), "confirmed");
      case Network.TESTNET:
        return new Connection(clusterApiUrl("testnet"), "confirmed");
    }
  }, [selectedNetwork]);
    
  return connection;
};

export default useSolConnection;
