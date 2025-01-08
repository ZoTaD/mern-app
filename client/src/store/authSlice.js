import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Interceptor de solicitudes para capturar errores globales (opcional)
axios.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Acción para iniciar sesión
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/login`,
            credentials,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Devuelve { token: '...', user: { ... } }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error al iniciar sesión');
    }
});

// Acción para registrar usuario
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/register`,
            userData,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // Devuelve mensaje de éxito
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error al registrar usuario');
    }
});

// Slice de autenticación
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null,
        success: false, // Indica si el registro fue exitoso
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token'); // Limpia el token del almacenamiento local
        },
        resetState: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem('token', action.payload.token); // Guarda el token en localStorage
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
                state.success = true; // Marca el registro como exitoso
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false; // Asegura que success sea falso si hay un error
            });
    },
});

export const { logout, resetState } = authSlice.actions;
export default authSlice.reducer;
