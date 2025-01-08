import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function Register({ onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const [generalError, setGeneralError] = useState('');
    const { loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    // Función para verificar si el email o usuario ya existen
    const checkEmailOrUsernameExists = async (email, username) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/check-user`, { email, username });
            if (response.data.emailExists) {
                setEmailError('El email ya está registrado.');
            } else {
                setEmailError('');
            }
            if (response.data.usernameExists) {
                setGeneralError('El nombre de usuario ya está registrado.');
            } else {
                setGeneralError('');
            }
        } catch (err) {
            console.error('Error al verificar el email o usuario:', err);
            setGeneralError('No se pudo verificar la disponibilidad.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (emailError || generalError) {
            alert('Por favor, corrige los errores antes de continuar.');
            return;
        }

        dispatch(register({ username, email, password })).then((result) => {
            console.log('Resultado del registro:', result); // Log del registro
            if (result.meta.requestStatus === 'fulfilled') {
                console.log('Registro exitoso, redirigiendo al login.');
                navigate('/', { state: { successMessage: 'Registro exitoso. Por favor, inicia sesión.' } });
            } else {
                console.error('Error en el registro:', result.payload || 'Error desconocido');
            }
        });
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value.includes('@') && value.includes('.')) {
            checkEmailOrUsernameExists(value, username);
        } else {
            setEmailError('El formato del email no es válido.');
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (email.includes('@') && email.includes('.')) {
            checkEmailOrUsernameExists(email, value);
        }
    };


    return (
        <div className="fullscreen-container">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} lg={4}>
                        <Card className="p-4 shadow">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">Registrarse</Card.Title>
                                {generalError && <p className="text-danger">{generalError}</p>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="username" className="mb-3">
                                        <Form.Label>Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu usuario"
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingresa tu email"
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                        {emailError && <p className="text-danger">{emailError}</p>}
                                    </Form.Group>
                                    <Form.Group controlId="password" className="mb-3">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Ingresa tu contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Registrarse'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <Button
                                        variant="link"
                                        onClick={() => navigate('/')}
                                        className="text-decoration-none"
                                    >
                                        ← Volver al Login
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register;
