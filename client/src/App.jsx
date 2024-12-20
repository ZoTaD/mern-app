import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import { Container, Row } from 'react-bootstrap';

function App() {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggle = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <Router>
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }} // Fondo gris claro
            >
                <Row className="w-100">
                    <Routes>
                        {/* Ruta principal con Login y Registro */}
                        <Route
                            path="/"
                            element={
                                isRegistering ? (
                                    <Register onSwitchToLogin={handleToggle} /> // Botón para volver al Login en el Register
                                ) : (
                                    <Login onSwitchToRegister={handleToggle} /> // Botón para ir al Register en el Login
                                )
                            }
                        />
                        {/* Ruta para el Home */}
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </Row>
            </Container>
        </Router>
    );
}

export default App;
