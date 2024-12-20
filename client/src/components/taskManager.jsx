import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice';
import { Table, Form, Button, Container, Row, Col } from 'react-bootstrap';

function TaskManager() {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        dispatch(createTask(newTask));
        setNewTask({ title: '', description: '' });
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        dispatch(updateTask({ id: editingTask._id, data: newTask }));
        setEditingTask(null);
        setNewTask({ title: '', description: '' });
    };

    const handleDeleteTask = (id) => {
        dispatch(deleteTask(id));
    };

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
                            <Col md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Título"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="mb-2"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Descripción"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    className="mb-2"
                                />
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
                <Col>
                    {loading ? (
                        <p className="text-center">Cargando tareas...</p>
                    ) : error ? (
                        <p className="text-center text-danger">Error: {error}</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id}>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default TaskManager;
