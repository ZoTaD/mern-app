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

// Actualizar una tarea
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            // Obtener el token del almacenamiento local
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token no disponible');

            // Realizar la solicitud al backend
            const response = await axios.put(`${API_URL}/api/tasks/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Devolver la tarea actualizada del backend
            return response.data;
        } catch (error) {
            // Manejar errores y devolver un mensaje claro
            const errorMessage =
                error.response?.data?.message || error.message || 'Error al actualizar la tarea';
            return rejectWithValue(errorMessage);
        }
    }
);

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
    initialState: { tasks: [], loading: false, error: null },
    reducers: {
        updateLocalOrder: (state, action) => {
            const { tasks, status } = action.payload;
            state.tasks = state.tasks.map((task) =>
                task.status === status ? tasks.find((t) => t._id === task._id) || task : task
            );
        },
        updateLocalMove: (state, action) => {
            const { sourceTasks, destinationTasks, sourceColumn, destinationColumn } = action.payload;

            // Actualizamos las tareas del origen y el destino
            state.tasks = state.tasks.map((task) => {
                if (task.status === sourceColumn) {
                    return sourceTasks.find((t) => t._id === task._id) || task;
                }
                if (task.status === destinationColumn) {
                    return destinationTasks.find((t) => t._id === task._id) || task;
                }
                return task;
            });
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
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateTaskPosition.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.findIndex((task) => task._id === updatedTask._id);

                if (index !== -1) {
                    state.tasks[index] = updatedTask; // Actualizar la tarea con la nueva posición
                }
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const index = state.tasks.findIndex((task) => task._id === updatedTask._id);

                if (index !== -1) {
                    state.tasks[index] = updatedTask; // Actualizar solo la tarea modificada
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task._id !== action.payload);
            });

    },
});

export default taskSlice.reducer;
