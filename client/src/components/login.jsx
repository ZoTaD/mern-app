import React, { useState } from 'react';
import axios from 'axios';

function Login({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // validacion de inputs
    const validateInputs = () => {
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Por favor ingresa un email válido');
            return false;
        }
        setError('');
        return true;
    };

    // envio de datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            console.log('Login exitoso:', response.data);
            setError('');
        } catch (err) {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Iniciar sesión</button>
            </form>
            <button onClick={onSwitchToRegister}>Registrarse</button>
        </div>
    );
}

export default Login;
