import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Obtener tareas del servidor
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Crear una nueva tarea
export const createTask = createAsyncThunk('tasks/createTask', async (task, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/tasks', task, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// Actualizar una tarea
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Eliminar una tarea
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const taskSlice = createSlice({
    // El builder se usa para definir acciones específicas que afectan el estado global dependiendo de los estados de la petición: pending, fulfilled o rejected.
    name: 'tasks',
    initialState: { tasks: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.map((task) =>
                    task._id === action.payload._id ? action.payload : task
                );
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task._id !== action.payload);
            });
    },
});

export default taskSlice.reducer;
