import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask, updateTaskPosition } from '../store/taskSlice';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../styles/TaskManager.module.css';
import Swal from 'sweetalert2';

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

        if (!destination) return; // Si no hay destino, salir

        const sourceColumn = source.droppableId;
        const destinationColumn = destination.droppableId;
        const sourceIndex = source.index;
        const destinationIndex = destination.index;

        // Copiar las columnas del estado actual
        const sourceTasks = [...columns[sourceColumn]];
        const destinationTasks =
            sourceColumn === destinationColumn
                ? sourceTasks
                : [...columns[destinationColumn]];

        // Remover la tarea de la columna de origen
        const [movedTask] = sourceTasks.splice(sourceIndex, 1);

        // Insertar la tarea en la nueva columna en la posición deseada
        destinationTasks.splice(destinationIndex, 0, movedTask);

        // Actualizar órdenes locales
        sourceTasks.forEach((task, index) => (task.order = index));
        destinationTasks.forEach((task, index) => (task.order = index));

        // Actualizar el estado local
        dispatch({
            type: 'tasks/updateColumns',
            payload: {
                ...columns,
                [sourceColumn]: sourceTasks,
                [destinationColumn]: destinationTasks,
            },
        });

        // Confirmar actualización con el backend
        dispatch(
            updateTaskPosition({
                id: movedTask._id,
                status: destinationColumn,
                order: destinationIndex,
            })
        ).catch((error) => {
            console.error('Error al actualizar en el backend:', error);

            // Revertir cambios si el backend falla
            dispatch(fetchTasks());
        });
    };

    // Agrupar tareas por su estado
    const groupedTasks = useSelector((state) => state.tasks.columns);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container>
                <Row>
                    {Object.keys(groupedTasks).map((column) => (
                        <Col key={column} md={4}>
                            <h3>{column}</h3>
                            <Droppable droppableId={column}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={styles['droppable-column']}
                                    >
                                        {groupedTasks[column].map((task, index) => (
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
                                                            className={`mb-3 ${styles['card-glass']}`}
                                                        >
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                                    <div style={{ display: 'flex', gap: '42px' }}>
                                                                        <h6 className=" text-white-important">#{index + 1}</h6>
                                                                        <h5>{task.title}</h5>
                                                                    </div>
                                                                </div>
                                                                <p>{task.description}</p>
                                                                <small className=" text-white-important">Creado el: {formatDate(task.createdAt)}</small>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-between">
                                                                <Button
                                                                    className={styles['button-glass']}
                                                                    size="sm"
                                                                    onClick={() => handleEditClick(task)}
                                                                >
                                                                    Editar
                                                                </Button>
                                                                <Button
                                                                    className={styles['button-glass']}
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
