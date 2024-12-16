import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskManager() {
    const [tasks, setTasks] = useState([]); // Almacenar todas las tareas
    const [newTask, setNewTask] = useState({ title: '', description: '' }); // Nueva tarea
    const [editingTask, setEditingTask] = useState(null); // Tarea en modo edición

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(response.data);
            } catch (error) {
                console.log('Error al obtener las tareas:', error.response?.data || error.message);
            }
        };

        fetchTasks();
    }, []);

    // Crear una nueva tarea
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks([...tasks, response.data]);
            setNewTask({ title: '', description: '' });
        } catch (error) {
            console.log('Error al crear la tarea:', error.response?.data || error.message);
        }
    };

    // Editar una tarea existente
    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/api/tasks/${editingTask._id}`,
                { title: newTask.title, description: newTask.description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // Actualizar la lista de tareas con la tarea editada
            setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data : task)));
            setEditingTask(null);
            setNewTask({ title: '', description: '' });
        } catch (error) {
            console.log('Error al actualizar la tarea:', error.response?.data || error.message);
        }
    };

    // Eliminar una tarea
    const handleDeleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.log('Error al eliminar la tarea:', error.response?.data || error.message);
        }
    };

    // Establecer el modo edición
    const handleEditClick = (task) => {
        setEditingTask(task); // Configurar la tarea en edición
        setNewTask({ title: task.title, description: task.description }); // Prellenar el formulario
    };

    return (
        <div>
            <h3>Gestión de tareas</h3>

            {/* Formulario para crear o editar tareas */}
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                <input
                    type="text"
                    placeholder="Título"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <button type="submit">{editingTask ? 'Actualizar Tarea' : 'Agregar Tarea'}</button>
                {editingTask && (
                    <button type="button" onClick={() => setEditingTask(null)}>
                        Cancelar
                    </button>
                )}
            </form>

            {/* Lista de tareas */}
            {tasks.length > 0 ? (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            <strong>{task.title}</strong>: {task.description}
                            <button onClick={() => handleEditClick(task)}>Editar</button>
                            <button onClick={() => handleDeleteTask(task._id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes tareas aún.</p>
            )}
        </div>
    );
}

export default TaskManager;
