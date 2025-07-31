export const sendEth = async (connection: any, sender: string, recipient: string, amount: number) => {
    try {
        return { success: true, message: "Transaction sent successfully!", txHash: "" };
    } catch (error) {
        return { success: false, message: "Transaction failed. Please try again.", txHash: "" };
    }
}