"use client"
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/auth/authSlice';
/**
const rootReducer = combineReducers({
    auth: 
      //add all your reducers here
}) */

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
console.log("Estado inicial del store:", store.getState()); // Esto mostrará el estado inicial

export default store;