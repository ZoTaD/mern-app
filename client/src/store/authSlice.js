import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config) => {
    console.log('Solicitud Axios:', config);
    return config;
}, (error) => {
    console.error('Error en la solicitud Axios:', error);
    return Promise.reject(error);
});

// Acción para iniciar sesión
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/auth/login`,
            credentials,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data; // { token: '...', user: { ... } }
    } catch (error) {
        console.error('Error en el login:', error.response || error.message); // Log del error recibido
        const errorMessage = error.response?.data || 'Error al iniciar sesión';
        return rejectWithValue(errorMessage);
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
        return response.data; // Mensaje de éxito
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
        return rejectWithValue(errorMessage); // Retorna el mensaje de error al frontend
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
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token'); // Eliminar token
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem('token', action.payload.token); // Guardar token
                console.log('Token guardado en localStorage:', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
