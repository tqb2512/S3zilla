import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import buckets from '@/libs/Redux/features/slices/buckets';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
    buckets,
});

export function createPersistStore() {
    const isServer = typeof window === "undefined";
    if (isServer) {
        return {
            getItem() {
                return Promise.resolve(null);
            },
            setItem() {
                return Promise.resolve();
            },
            removeItem() {
                return Promise.resolve();
            },
        };
    }
    return createWebStorage("local");
}
const storage = typeof window !== "undefined"
    ? createWebStorage("local")
    : createPersistStore();

const persist = {
    key: 'root',
    storage: storage,
}

const persistedReducer = persistReducer(persist, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});


export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;