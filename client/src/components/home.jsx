import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [name, setName] = useState('');
    const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                // Obtener datos del usuario
                const userResponse = await axios.get('http://localhost:5000/api/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(userResponse.data.name);

                // Obtener las tareas
                const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(tasksResponse.data); // Guardar las tareas en el estado
            } catch (error) {
                console.log('Error:', error.response?.data || error.message);
                navigate('/');
            }
        };

        fetchUserData();
    }, [navigate]);

    const deslogear = () => {
        localStorage.removeItem('token'); // Remover el token al cerrar sesión
        navigate('/');
    };

    return (
        <div>
            <h2>Bienvenido, {name}</h2>
            <button onClick={deslogear}>Cerrar sesión</button>
            <h3>Mis tareas:</h3>
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            <strong>{task.title}</strong>: {task.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes tareas aún.</p>
            )}
        </div>
    );
}

export default Home;
