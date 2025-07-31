import { configureStore } from "@reduxjs/toolkit";
import walletsReducer from "@/features/walletSlice";
import networksReducer from "@/features/networkSlice";
import chainsReducer from "@/features/chainSlice";
import { walletMiddleware } from "@/middlewares/walletMiddleware";

const store = configureStore({
    reducer: {
        wallets: walletsReducer,
        networks: networksReducer,
        chains: chainsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(walletMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;