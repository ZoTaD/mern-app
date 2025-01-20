import React, { act } from 'react'; // Cambiar importación de act
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import Register from '../components/register';

const mockStore = configureStore();

describe('Register Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { loading: false },
        });

        store.dispatch = jest.fn().mockImplementation(() => ({
            unwrap: jest.fn().mockResolvedValueOnce({}),
        }));
    });

    test('renders the register form and submits successfully', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>
        );

        const usernameInput = screen.getByTestId('username');
        const emailInput = screen.getByTestId('email');
        const passwordInput = screen.getByTestId('password');
        const submitButton = screen.getByRole('button', { name: /registrarse/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(store.dispatch).toHaveBeenCalled();
    });

    test('shows email error when an invalid email is entered', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Register />
                </MemoryRouter>
            </Provider>
        );

        const emailInput = screen.getByTestId('email');

        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        expect(screen.getByText('Por favor, ingresa un email válido.')).toBeInTheDocument();
    });
});
