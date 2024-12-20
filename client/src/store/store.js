import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

export const store = configureStore({ reducer: { task: taskReducer } }); // para configurar el store con el reducer de taskSlice

