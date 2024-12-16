import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskManager from './taskManager'; // Importar TaskManager

function Home() {
    const [name, setName] = useState(''); // Estado para el nombre del usuario
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            console.log('Iniciando fetch de datos del usuario...');
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Token no encontrado, redirigiendo al login...');
                    navigate('/');
                    return;
                }

                const userResponse = await axios.get('http://localhost:5000/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(userResponse.data.name); // Guardar el nombre del usuario
                console.log('Nombre del usuario recibido:', userResponse.data.name);
            } catch (error) {
                console.log('Error durante la obtención de datos:', error.response?.data || error.message);
                navigate('/'); // Redirigir al login en caso de error
            }
        };

        fetchUserData();
    }, [navigate]);

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
        navigate('/');
    };

    return (
        <div>
            <h2>Bienvenido, {name}</h2>
            <button onClick={handleLogout}>Cerrar sesión</button>

            {/* Renderizar TaskManager */}
            <TaskManager />
        </div>
    );
}

export default Home;
