export interface Chain {
  id: string
  name: string
  icon: string
  color: string
  ticker: string
}

export interface WalletAccount {
  id: number
  name: string
  address: string
  balance: number
  balanceUSD: number
  chain: Chain
}

// export interface Network {
//     id: NetworkId
//     url: string
// }

// export interface SolanaMainnet extends Network {
//     id: "mainnet"
//     url: "https://api.mainnet-beta.solana.com"
// }

// export interface SolanaDevnet extends Network {
//     id: "devnet"
//     url: "https://api.devnet.solana.com"
// }

// export interface SolanaTestnet extends Network {
//     id: "testnet"
//     url: "https://api.testnet.solana.com"
// }

// export type NetworkId = "mainnet" | "devnet" | "testnet";


export enum Network {
      MAINNET = "mainnet",
      DEVNET = "devnet",
      TESTNET = "testnet"
}