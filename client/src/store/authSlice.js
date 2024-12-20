import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción para iniciar sesión
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
        return response.data; // { token: '...', user: { ... } }
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Error al iniciar sesión');
    }
});

// Acción para registrar usuario
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        //Hago la solicitud al backend con axios
        const response = await axios.post('http://localhost:5000/api/auth/register', userData);
        return response.data; // Mensaje de éxito
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