import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import connection from "@/connection/solConnection";
export const sendSol = async (sender: string, recipient: string, amount: number) => {
    try {
    const senderPublicKey = new PublicKey(sender);
    const recipientPublicKey = new PublicKey(recipient);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderPublicKey,
            toPubkey: recipientPublicKey,
            lamports: amount * 1e9,
        })
    );
    const signature = await connection.sendRawTransaction(transaction.serialize());
    return { success: true, message: "Transaction sent successfully!", txHash: signature };
    } catch (error) {
        console.error("Error sending transaction:", error);
        return { success: false, message: "Transaction failed. Please try again.", txHash: "" };
    }
}
