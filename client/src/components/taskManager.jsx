import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../styles/TaskManager.module.css';
import Swal from 'sweetalert2';
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
        const taskToCreate = {
            ...newTask,
            status: newTask.status || 'Pendiente', // Si no se especifica, usar 'Pendiente'
        };
        dispatch(createTask(taskToCreate));
        setNewTask({ title: '', description: '', status: 'Pendiente' });
    };

    // Actualizar
    const handleUpdateTask = async (e) => {
        e.preventDefault();

        // Creo un objeto con los datos actualizados
        const updatedTask = {
            ...newTask, // Incluir title, description y status
        };

        await dispatch(updateTask({ id: editingTask._id, data: updatedTask }));
        setEditingTask(null);
        setNewTask({ title: '', description: '', status: 'Pendiente' });
    };

    // Borrar
    const handleDeleteTask = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteTask(id));
                Swal.fire('Eliminado', 'La tarea ha sido eliminada.', 'success');
            }
        });
    };

    // Editar
    const handleEditClick = (task) => {
        setEditingTask(task);
        setNewTask({ title: task.title, description: task.description, status: task.status, });
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId !== destination.droppableId) {
            const task = groupedTasks[source.droppableId][source.index];

            // Actualizar el estado local
            const updatedTask = {
                ...task,
                status: destination.droppableId,
            };

            // Actualizar el estado de Redux localmente
            dispatch(updateTask.fulfilled(updatedTask));

            // Enviar la actualización al backend
            dispatch(updateTask({ id: task._id, data: updatedTask }));
        }
    };


    // Agrupar tareas por su estado
    const groupedTasks = {
        Pendiente: tasks.filter((task) => task.status === 'Pendiente'),
        'En Progreso': tasks.filter((task) => task.status === 'En Progreso'),
        Completada: tasks.filter((task) => task.status === 'Completada'),
    };


    return (
        <DragDropContext onDragEnd={handleDragEnd}>
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
                <Row className={styles['no-wrap-row']} >
                    {['Pendiente', 'En Progreso', 'Completada'].map((status) => (
                        <Col
                            md={4}
                            key={status}
                            className={
                                status === 'Pendiente'
                                    ? styles['pending-column']
                                    : status === 'En Progreso'
                                        ? styles['in-progress-column']
                                        : styles['completed-column']
                            }
                        >
                            <div className={styles['droppable-column']}>
                                <h3 className="text-center">{status}</h3>
                                <Droppable droppableId={status}>
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                                minHeight: '200px',
                                                height: '100%',
                                                borderRadius: '5px',
                                            }}
                                        >
                                            {groupedTasks[status].map((task, index) => (
                                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                                    {(provided) => (
                                                        <Card
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-3 ${styles['card-glass']}`} // Aplica la clase de vidrio
                                                            style={{ color: 'white' }}
                                                        >
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <div style={{ display: 'flex', gap: '42px' }}>
                                                                        <h6 style={{ color: 'white' }} className="text-muted">#{index + 1}</h6>
                                                                        <h5>{task.title}</h5>
                                                                    </div>
                                                                </div>
                                                                <p>{task.description}</p>
                                                                <small style={{ color: 'white' }} className="text-muted">Creado el: {formatDate(task.createdAt)}</small>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-between">
                                                                <Button
                                                                    className={styles['button-glass']} // Aplica la clase de vidrio a los botones
                                                                    size="sm"
                                                                    onClick={() => handleEditClick(task)}
                                                                >
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    className={styles['button-glass']} // Aplica la clase de vidrio a los botones
                                                                    size="sm"
                                                                    onClick={() => handleDeleteTask(task._id)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </Card.Footer>
                                                        </Card>

                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </DragDropContext>
    );



}

export default TaskManager;
