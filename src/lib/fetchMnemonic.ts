export const fetchMnemonic = async (): Promise<string | null> => {
    if(typeof window === "undefined") return null;
    const mnemonic = localStorage.getItem("mnemonic");
    return mnemonic;
}