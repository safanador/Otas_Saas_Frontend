"use client"
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/auth/authSlice';
import storage from "redux-persist/lib/storage"; // Usa localStorage
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { combineReducers } from "redux";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authReducer),
      //add all your reducers here
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export {persistor};