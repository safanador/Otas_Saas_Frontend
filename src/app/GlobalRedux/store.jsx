"use client"
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/auth/authSlice';

const rootReducer = combineReducers({
    auth: authReducer
      //add all your reducers here
})

export const store = configureStore({
  reducer: {
    auth: rootReducer,
  },
});