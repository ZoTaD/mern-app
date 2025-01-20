import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice';
import axios from 'axios';
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../store/taskSlice';
import authReducer from '../store/authSlice'; // Importa el reducer de autenticación
import { login } from '../store/authSlice'; // Acción para iniciar sesión

jest.mock('axios');

describe('Task Slice', () => {
    let store;

    const mockUser = { email: 'test@example.com', password: 'password123' };
    const mockToken = 'mock-token';

    beforeEach(async () => {
        // Configura la tienda con los reducers de tasks y auth
        store = configureStore({ reducer: { tasks: taskReducer, auth: authReducer } });

        // Mockea localStorage usando jest.spyOn
        jest.spyOn(global.localStorage.__proto__, 'setItem').mockImplementation(jest.fn());
        jest.spyOn(global.localStorage.__proto__, 'getItem').mockImplementation((key) => {
            if (key === 'token') return mockToken;
            return null;
        });
        jest.spyOn(global.localStorage.__proto__, 'removeItem').mockImplementation(jest.fn());

        // Mock de la solicitud de inicio de sesión
        axios.post.mockResolvedValueOnce({ data: { token: mockToken } });

        // Autentica al usuario antes de las pruebas
        const loginResult = await store.dispatch(login(mockUser));
        expect(loginResult.type).toBe('auth/login/fulfilled');
        expect(global.localStorage.setItem).toHaveBeenCalledWith('token', mockToken); // Ahora funcionará
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch tasks successfully', async () => {
        const mockTasks = [
            { _id: '1', title: 'Task 1', description: 'Description 1', status: 'Pendiente' },
            { _id: '2', title: 'Task 2', description: 'Description 2', status: 'En Progreso' },
        ];
        axios.get.mockResolvedValueOnce({ data: mockTasks });

        const result = await store.dispatch(fetchTasks());
        console.log(result); // Inspecciona el resultado

        expect(result.type).toBe('tasks/fetchTasks/fulfilled');
        expect(result.payload).toEqual(mockTasks);
        expect(store.getState().tasks.tasks).toEqual(mockTasks);
    });

    it('should create a task successfully', async () => {
        const newTask = { _id: '3', title: 'Task 3', description: 'Description 3', status: 'Pendiente' };
        axios.post.mockResolvedValueOnce({ data: newTask });

        const result = await store.dispatch(createTask(newTask));
        console.log(result); // Inspecciona el resultado

        expect(result.type).toBe('tasks/createTask/fulfilled');
        expect(result.payload).toEqual(newTask);
        expect(store.getState().tasks.tasks).toContainEqual(newTask);
    });

    it('should update a task successfully', async () => {
        // Define el estado inicial
        const initialTasks = [
            { _id: '1', title: 'Task 1', description: 'Description 1', status: 'Pendiente' },
            { _id: '2', title: 'Task 2', description: 'Description 2', status: 'En Progreso' },
        ];
        store = configureStore({
            reducer: { tasks: taskReducer, auth: authReducer },
            preloadedState: { tasks: { tasks: initialTasks, loading: false, error: null }, auth: {} },
        });

        const updatedTask = {
            _id: '1',
            title: 'Updated Task 1',
            description: 'Updated Description',
            status: 'Completada',
        };
        axios.put.mockResolvedValueOnce({ data: updatedTask });

        const result = await store.dispatch(updateTask({ id: '1', data: updatedTask }));
        console.log(result); // Inspecciona el resultado

        expect(result.type).toBe('tasks/updateTask/fulfilled');
        expect(result.payload).toEqual(updatedTask);
        expect(store.getState().tasks.tasks.find((task) => task._id === '1')).toEqual(updatedTask);
    });


    it('should delete a task successfully', async () => {
        const taskId = '1';
        axios.delete.mockResolvedValueOnce({ data: taskId });

        const result = await store.dispatch(deleteTask(taskId));
        console.log(result); // Inspecciona el resultado

        expect(result.type).toBe('tasks/deleteTask/fulfilled');
        expect(result.payload).toBe(taskId);
        expect(store.getState().tasks.tasks.find((task) => task._id === taskId)).toBeUndefined();
    });
});
