// "use server"
import { mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import * as ecc from 'tiny-secp256k1'
import { BIP32Factory } from 'bip32'
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import { WalletAccount, Chain  } from "@/lib/types";
import { CHAINS } from "@/lib/data";

export class SolWallet implements WalletAccount {
  id: number
  name: string
  address: string
  balance: number
  balanceUSD: number
  chain: Chain
    constructor(id: number, address: string) {
        this.id = id;
        this.name = `Wallet ${id}`;
        this.address = address;
        this.balance = 0;
        this.balanceUSD = 0;
        this.chain = CHAINS[0];
               
    }
}
const genSolKeys = (mnemonic: string, accountIndex = 0) => {
  const seed = mnemonicToSeedSync(mnemonic);
  const solPath = `m/44'/501'/${accountIndex}'/0'`;
  const { key } = derivePath(solPath, seed.toString("hex"));
  const solKeypair = Keypair.fromSeed(key);
  const solPublicKey = solKeypair.publicKey.toBase58();
  const solPrivateKey = Buffer.from(solKeypair.secretKey).toString("hex");
 
  return { privateKey: solPrivateKey, address: solPublicKey };
};

export class EthWallet implements WalletAccount {
  id: number
  name: string
  address: string
  balance: number
  balanceUSD: number
  chain: Chain
    constructor(address: string, id: number) {
        this.id = id;
        this.name = `Wallet ${id}`;
        this.address = address;
        this.balance = 0;
        this.balanceUSD = 0;
        this.chain = CHAINS[0];
    } 
}

const bip32 = BIP32Factory(ecc)
// TODO: incorrect logic, fix later
const genEthKeys = (
  mnemonic: string,
  accountIndex = 0
): { address: string; privateKey: string } => {
  const seed = mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);
  const path = `m/44'/60'/0'/0/${accountIndex}`;
  const child = root.derivePath(path);
  if (!child.privateKey) throw new Error("No private key");
  const privateKey = child.privateKey.toString();
  const publicKey = new ethers.Wallet(privateKey).address;
  return { address: publicKey, privateKey };
}

export {genSolKeys, genEthKeys}