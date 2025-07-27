export const sendEth = async (sender: string, recipient: string, amount: number) => {
    try {
        return { success: true, message: "Transaction sent successfully!", txHash: "" };
    } catch (error) {
        return { success: false, message: "Transaction failed. Please try again.", txHash: "" };
    }
}