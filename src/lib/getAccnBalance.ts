import { Connection, PublicKey } from "@solana/web3.js";

export async function getSolanaBalance(connection: Connection, publicKeyStr: string): Promise<number> {
  console.log(connection)
  try {
    const publicKey = new PublicKey(publicKeyStr);
    const lamports = await connection.getBalance(publicKey);
    const sol = lamports / 1e9; 
    return sol;
  } catch (error) {
    console.error("Failed to get balance:", error);
    throw error;
  }
}
