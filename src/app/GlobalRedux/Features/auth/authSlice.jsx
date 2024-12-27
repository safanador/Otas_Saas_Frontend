"use client"
import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  user: null, // Información del usuario autenticado
  isAuthenticated: false, // Estado de autenticación
};

export const authSlice = createSlice({
  name: 'auth', // Nombre del slice
  initialState,
  reducers: {
    // Acción para establecer la información del usuario
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Acción para eliminar la información del usuario (logout)
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Exportar las acciones
export const { setUser, clearUser } = authSlice.actions;

// Exportar el reducer para configurarlo en el store
export default authSlice.reducer;
