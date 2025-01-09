import express from 'express';
import Task from '../models/task.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para autenticar al usuario
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' }); // Si no hay token
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        req.userId = decoded.id; // Almacenar el ID del usuario
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Endpoint para crear una nueva tarea
router.post('/', authenticate, async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = new Task({
            title,
            description,
            user: req.userId, // Asociar la tarea al usuario autenticado
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea' });
    }
});

// Endpoint para obtener todas las tareas del usuario autenticado
router.get('/', authenticate, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }); // Filtrar tareas por el ID del usuario
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

// Endpoint para actualizar una tarea
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, user: req.userId },
            { title, description, status },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea' });
    }
});

// Endpoint para eliminar una tarea
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.userId });
        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
        }
        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});

export default router;
