import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

function Login({ onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.successMessage;

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos enviados:', { email, password });

        dispatch(login({ email, password })).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                console.log('Resultado del login:', result);
                navigate('/home');
            } else {
                console.error('Error en login:', result.payload || 'Error desconocido');
            }
        });

    };

    return (
        <div className="fullscreen-container">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} lg={4}>
                        <Card className="p-4 shadow">
                            <Card.Body>
                                <Card.Title className="text-center mb-4">Iniciar sesión</Card.Title>

                                {/* Mostrar mensaje de éxito solo si existe */}
                                {successMessage && <p className="text-success">{successMessage}</p>}

                                {/* Mostrar mensaje de error solo si no hay mensaje de éxito */}
                                {!successMessage && error && <p className="text-danger">{error}</p>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingresa tu email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
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
                                        {loading ? 'Cargando...' : 'Iniciar sesión'}
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <Button
                                        variant="link"
                                        onClick={() => navigate('/register')}
                                        className="text-decoration-none"
                                    >
                                        Registrarse
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

export default Login;
