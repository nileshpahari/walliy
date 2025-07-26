// demo data
export const CHAINS: Chain[] = [
  { id: "solana", name: "Solana", icon: "/sol.svg", color: "bg-purple-500" },
  { id: "ethereum", name: "Ethereum", icon: "/eth.svg", color: "bg-blue-500" },
]
import { Chain, WalletAccount } from "./types"
export const DUMMY_WALLETS: WalletAccount[] = [
  {
    id: 1,
    name: "Imported Wallet 1",
    address: "7M3scKNzxg39SwA8bi6z9u44Bx4556fFJHygRd3mdvxY",
    balance: 1.78,
    balanceUSD: 1784.50,
    chain: CHAINS[0],
  },
  {
    id: 2,
    name: "Main Wallet",
    address: "83kkrgEcqvVX9Lfo7nhsJnzUV8m8VpqFmxqDevQngLE6",
    balance: 0.00,
    balanceUSD: 0.00,
    chain: CHAINS[0],
  },
  {
    id: 3,
    name: "Trading Wallet",
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    balance: 2.45,
    balanceUSD: 6127.80,
    chain: CHAINS[1],
  },
  {
    id: 4,
    name: "DeFi Wallet",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    balance: 156.78,
    balanceUSD: 156.78,
    chain: CHAINS[1],
  },
]

export  type {Chain, WalletAccount}