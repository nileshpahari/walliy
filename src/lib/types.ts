export interface Chain {
  id: string
  name: string
  icon: string
  color: string
}

export interface WalletAccount {
  id: number
  name: string
  address: string
  balance: number
  balanceUSD: number
  chain: Chain
}

export enum Net {
    DEVNET = "devnet",
    MAINNET = "mainnet-beta",
    TESTNET = "testnet",
}