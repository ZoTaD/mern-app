import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskManager from './taskManager';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styles from '../styles/TaskManager.module.css'; // Importar los estilos

function Home() {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/'); // Redirigir al login si no hay token
                    return;
                }

                const userResponse = await axios.get(`${API_URL}/api/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setName(userResponse.data.name); // Configura el nombre del usuario
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                navigate('/'); // Redirigir al login si hay un error
            }
        };

        fetchUserData();
    }, [navigate, API_URL]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Container fluid style={{ minHeight: '100vh', paddingTop: '20px' }}>
            <Row className="align-items-center mb-4">
                <Col>
                    <h1 className={`text-left ${styles['text-white-important']}`}>Bienvenido {name}</h1>
                </Col>
                <Col xs="auto" className="text-end">
                    <Button
                        className={styles['button-glass']} // Aplica estilo de vidrio al botón
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TaskManager />
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
