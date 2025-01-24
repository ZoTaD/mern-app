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

// Eliminar una tarea
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');
        await axios.delete(`${API_URL}/api/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return id;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al eliminar la tarea';
        return rejectWithValue(errorMessage);
    }
});

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
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;

                // Agrupar tareas por columna
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

                state.columns = columns; // Actualizar columnas
                state.error = null;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                const task = action.payload;
                if (state.columns[task.status]) {
                    state.columns[task.status].push(task);
                }
            })
            .addCase(updateTaskPosition.fulfilled, (state, action) => {
                const updatedTask = action.payload;

                // Remover tarea de la columna anterior
                Object.keys(state.columns).forEach((column) => {
                    state.columns[column] = state.columns[column].filter(
                        (task) => task._id !== updatedTask._id
                    );
                });

                // Agregar tarea a la nueva columna con posición actualizada
                if (state.columns[updatedTask.status]) {
                    state.columns[updatedTask.status].splice(updatedTask.order, 0, updatedTask);
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const taskId = action.payload;
                Object.keys(state.columns).forEach((column) => {
                    state.columns[column] = state.columns[column].filter((task) => task._id !== taskId);
                });
            });
    },
});

export const { updateColumns } = taskSlice.actions;
export default taskSlice.reducer;
