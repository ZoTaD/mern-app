import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import taskReducer from './taskSlice';

const store = configureStore({
    reducer: {
        auth: authReducer, // Reducer para autenticación
        tasks: taskReducer, // Reducer para tareas
    },
});

export default store;
