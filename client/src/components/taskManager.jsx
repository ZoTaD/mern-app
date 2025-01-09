import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
// import { data } from 'react-router-dom';

function TaskManager() {
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);

    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options); // Formato DD/MM/AA
    };

    // Crear
    const handleCreateTask = (e) => {
        e.preventDefault();
        dispatch(createTask(newTask));
        setNewTask({ title: '', description: '' });
    };

    // Actualizar
    const handleUpdateTask = (e) => {
        e.preventDefault();

        // Crear un objeto con los datos actualizados
        const updatedTask = {
            ...newTask, // Incluir title, description y status
        };

        dispatch(updateTask({ id: editingTask._id, data: newTask, data: updatedTask }));
        setEditingTask(null);
        setNewTask({ title: '', description: '', status: 'Pendiente' });
        dispatch(fetchTasks()); // Actualizar lista de tareas
    };

    // Borrar
    const handleDeleteTask = (id) => {
        dispatch(deleteTask(id));
    };

    // Editar
    const handleEditClick = (task) => {
        setEditingTask(task);
        setNewTask({ title: task.title, description: task.description, status: task.status, });
    };

    return (
        <Container>
            <Row>

                <Col>
                    <h2 className="text-center mb-4">Gestión de tareas</h2>
                    <Form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                        <Row>
                            <Col md={3}>
                                <Form.Control
                                    type="text"
                                    placeholder="Título"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="mb-2"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="mb-2"
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Select
                                    value={newTask.status}
                                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                    className="mb-2"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Completada">Completada</option>
                                </Form.Select>
                            </Col>
                            <Col md="auto">
                                <Button type="submit" variant="primary" className="mb-2">
                                    {editingTask ? 'Actualizar' : 'Agregar'}
                                </Button>
                                {editingTask && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => setEditingTask(null)}
                                        className="mb-2 ms-2"
                                    >
                                        Cancelar
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {/* Columna de tareas pendientes */}
                <Col md={4}>
                    <h3 className="text-center">Pendiente</h3>
                    {tasks
                        .filter((task) => task.status === 'Pendiente')
                        .map((task, index) => (
                            <Card key={task._id} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 className="text-muted">#{index + 1}</h6>
                                            <h5>{task.title}</h5>
                                        </div>
                                    </div>
                                    <p>{task.description}</p>
                                    <small className="text-muted">
                                        Creado el: {formatDate(task.createdAt)}
                                    </small>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEditClick(task)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                </Col>
                {/* Columna de tareas en progreso */}
                <Col md={4}>
                    <h3 className="text-center">En Progreso</h3>
                    {tasks
                        .filter((task) => task.status === 'En Progreso')
                        .map((task, index) => (
                            <Card key={task._id} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 className="text-muted">#{index + 1}</h6>
                                            <h5>{task.title}</h5>
                                        </div>
                                    </div>
                                    <p>{task.description}</p>
                                    <small className="text-muted">
                                        Creado el: {formatDate(task.createdAt)}
                                    </small>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEditClick(task)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                </Col>
                {/* Columna de tareas completadas */}
                <Col md={4}>
                    <h3 className="text-center">Completada</h3>
                    {tasks
                        .filter((task) => task.status === 'Completada')
                        .map((task, index) => (
                            <Card key={task._id} className="mb-3">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 className="text-muted">#{index + 1}</h6>
                                            <h5>{task.title}</h5>
                                        </div>
                                    </div>
                                    <p>{task.description}</p>
                                    <small className="text-muted">
                                        Creado el: {formatDate(task.createdAt)}
                                    </small>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEditClick(task)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteTask(task._id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                </Col>
            </Row>
        </Container>
    );

}

export default TaskManager;
