import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Obtener tareas del servidor
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');
        const response = await axios.get(`${API_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al obtener las tareas';
        return rejectWithValue(errorMessage);
    }
});

// Crear una nueva tarea
export const createTask = createAsyncThunk('tasks/createTask', async (task, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');
        const response = await axios.post(`${API_URL}/api/tasks`, task, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al crear la tarea';
        return rejectWithValue(errorMessage);
    }
});

// Actualizar posición y columna de una tarea
export const updateTaskPosition = createAsyncThunk(
    'tasks/updateTaskPosition',
    async ({ id, status, order }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no disponible');
            const response = await axios.put(`${API_URL}/api/tasks/${id}/position`, { status, order }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Error al actualizar la posición de la tarea';
            return rejectWithValue(errorMessage);
        }
    }
);

// Configuración del slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        columns: {
            Pendiente: [],
            'En Progreso': [],
            Completada: [],
        },
        loading: false,
        error: null,
    },
    reducers: {
        updateColumns: (state, action) => {
            state.columns = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                const columns = {
                    Pendiente: [],
                    'En Progreso': [],
                    Completada: [],
                };
                action.payload.forEach((task) => {
                    if (columns[task.status]) {
                        columns[task.status].push(task);
                    }
                });
                state.columns = columns;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateTaskPosition.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                Object.keys(state.columns).forEach((column) => {
                    state.columns[column] = state.columns[column].filter(
                        (task) => task._id !== updatedTask._id
                    );
                });
                state.columns[updatedTask.status].splice(updatedTask.order, 0, updatedTask);
            });
    },
});

export const { updateColumns } = taskSlice.actions;
export default taskSlice.reducer;
