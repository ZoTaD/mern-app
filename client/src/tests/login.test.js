import React, { act } from 'react'; // Cambiar importación de act
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/login';

const mockStore = configureStore();

describe('Login Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { loading: false, error: null },
        });

        store.dispatch = jest.fn().mockResolvedValueOnce({
            meta: { requestStatus: 'fulfilled' },
        });
    });

    test('renders the login form and submits successfully', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        const emailInput = screen.getByPlaceholderText('Ingresa tu email');
        const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(store.dispatch).toHaveBeenCalled();
    });

    test('shows error message when login fails', () => {
        store = mockStore({
            auth: { loading: false, error: 'Credenciales incorrectas' },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
    });
});
