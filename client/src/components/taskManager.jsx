import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, deleteTask, updateTaskPosition } from '../store/taskSlice';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
import styles from '../styles/TaskManager.module.css';

function TaskManager() {
    const dispatch = useDispatch();
    const columns = useSelector((state) => state.tasks.columns); // Usar columnas directamente del estado

    const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Pendiente' });

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    // Crear nueva tarea
    const handleCreateTask = (e) => {
        e.preventDefault();
        dispatch(createTask(newTask));
        setNewTask({ title: '', description: '', status: 'Pendiente' });
    };

    // Eliminar tarea
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

    // Arrastrar y soltar tareas
    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const sourceColumn = source.droppableId;
        const destinationColumn = destination.droppableId;
        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        const sourceTasks = [...columns[sourceColumn]];
        const destinationTasks =
            sourceColumn === destinationColumn
                ? sourceTasks
                : [...columns[destinationColumn]];

        const [movedTask] = sourceTasks.splice(sourceIndex, 1);
        movedTask.status = destinationColumn; // Cambiar el estado
        destinationTasks.splice(destinationIndex, 0, movedTask);

        // Actualizar órdenes locales
        sourceTasks.forEach((task, index) => (task.order = index));
        destinationTasks.forEach((task, index) => (task.order = index));

        // Actualizar estado local
        dispatch({
            type: 'tasks/updateColumns',
            payload: {
                ...columns,
                [sourceColumn]: sourceTasks,
                [destinationColumn]: destinationTasks,
            },
        });

        // Actualizar en el backend
        dispatch(
            updateTaskPosition({
                id: movedTask._id,
                status: destinationColumn,
                order: destinationIndex,
            })
        ).catch((error) => {
            console.error('Error al actualizar en el backend:', error);
            dispatch(fetchTasks()); // Revertir cambios si el backend falla
        });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2>Gestión de Tareas</h2>
                        <Form onSubmit={handleCreateTask}>
                            <Row>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Título"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripción"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Button type="submit">Agregar Tarea</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    {Object.keys(columns).map((column) => (
                        <Col key={column} md={4}>
                            <h3>{column}</h3>
                            <Droppable droppableId={column}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={styles['droppable-column']}
                                    >
                                        {columns[column].map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={styles['card-glass']}
                                                    >
                                                        <Card.Body>
                                                            <h5>{task.title}</h5>
                                                            <p>{task.description}</p>
                                                            <Button
                                                                variant="danger"
                                                                onClick={() => handleDeleteTask(task._id)}
                                                                className="mt-2"
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    ))}
                </Row>
            </Container>
        </DragDropContext>
    );
}

export default TaskManager;
