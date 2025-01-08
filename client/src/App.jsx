import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import { Container, Row } from 'react-bootstrap';

function App() {
    return (
        <Router>
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
            >
                <Row className="w-100">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </Row>
            </Container>
        </Router>
    );
}

export default App;
