import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function Register({ onSwitchToLogin }) {
    const [emailError, setEmailError] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const validateEmail = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/check-user`, { email });
            if (response.data.emailExists) {
                setEmailError('El email ya está registrado.');
            } else {
                setEmailError('');
            }
        } catch (error) {
            console.error('Error al validar el email:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) {
            console.error('No se puede registrar con un email inválido');
            return;
        }
        dispatch(register({ username, email, password })).then((result) => {
            console.log('Resultado del registro:', result); // Agrega este log
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
        if (value) {
            validateEmail(value); // Validar email en tiempo real
        } else {
            setEmailError('');
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
                                {error && <p className="text-danger">{error}</p>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="username" className="mb-3">
                                        <Form.Label>Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Ingresa tu usuario"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
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
                                        {emailError && <p className="text-danger">{emailError}</p>} {/* Mostrar error */}
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
                                        disabled={loading || emailError !== ''}
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
