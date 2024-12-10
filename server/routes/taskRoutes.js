import express from 'express';
import Task from '../models/task.js';

const router = express.Router();

// Endpoint para crear una nueva tarea
router.post('/', async (req, res) => {
    console.log('Solicitud POST recibida en /tasks con datos:', req.body);
    const { title, description } = req.body;
    // Creo una nueva tarea
    try {
        const newTask = new Task({
            title,
            description,
        });
        // Guardo la tarea en la base de datos
        await newTask.save();
        // Devuelvo la tarea creada
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
});

// Endpoint para obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        // Buscar las tareas en la base de datos
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

// Endpoint para actualizar una tarea
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Obtenemos el ID de la tarea desde los parámetros de la URL
    const { title, description, completed } = req.body; // Nuevos datos de la tarea
    try {
        // Actualizamos la tarea con el ID proporcionado
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true } // Esto hace que la respuesta devuelva la tarea ya actualizada
        );
        // Si la tarea no se encuentra, enviamos un error 404
        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        // Respondemos con la tarea actualizada
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});

// Endpoint para eliminar una tarea 
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // Obtenemos el ID de la tarea desde los parámetros de la URL
    try {
        // Intentamos eliminar la tarea con el ID proporcionado
        const deletedTask = await Task.findByIdAndDelete(id);
        // Si la tarea no se encuentra, enviamos un error 404
        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        // Respondemos con un mensaje de éxito
        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});


export default router;

