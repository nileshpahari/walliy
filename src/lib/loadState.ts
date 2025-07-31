export const loadState = (item: string) => {
    if(typeof window === "undefined") return null;
    const state = localStorage.getItem(item);
    if(state) {
        return JSON.parse(state);
    }
    return null;
}
