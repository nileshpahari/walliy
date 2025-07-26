import { PublicKey } from "@solana/web3.js";
import solConnection from "@/connection/solConnection";

export async function getSolanaBalance(publicKeyStr: string) {
  const publicKey = new PublicKey(publicKeyStr);
  const lamports = await solConnection.getBalance(publicKey);
  const sol = lamports / 1e9; 
  return sol;
}
