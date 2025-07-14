"use server"
import { generateMnemonic } from "bip39";
export const getMnemonic = async () => {
    const words = generateMnemonic();
    let mnemonic = words.split(" ");
    return mnemonic;
}



