import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';

function TaskManager() {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

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
        dispatch(updateTask({ id: editingTask._id, data: newTask }));
        setEditingTask(null);
        setNewTask({ title: '', description: '' });
    };

    // Borrar
    const handleDeleteTask = (id) => {
        dispatch(deleteTask(id));
    };

    // Editar
    const handleEditClick = (task) => {
        setEditingTask(task);
        setNewTask({ title: task.title, description: task.description });
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
                {loading ? (
                    <p className="text-center">Cargando tareas...</p>
                ) : error ? (
                    <p className="text-center text-danger">Error: {error}</p>
                ) : (
                    tasks.map((task, index) => (
                        <Col key={task._id} md={4} className="mb-3">
                            <Card className="h-100">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h6 className="text-muted">#{index + 1}</h6>
                                            <h5>{task.title}</h5>
                                        </div>
                                        <div>
                                            <span className="badge bg-secondary">{task.status}</span>
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
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
}

export default TaskManager;
