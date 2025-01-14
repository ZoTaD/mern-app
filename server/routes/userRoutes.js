import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Endpoint para obtener datos del usuario
router.get('/', async (req, res) => {
    const token = req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : undefined;
    if (!token) {
        console.log('Token no proporcionado');
        return res.status(401).json({ message: 'No autorizado' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
        const user = await User.findById(decoded.id); // Buscar el usuario en la base de datos
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ name: user.username }); // Enviar el nombre del usuario
    } catch {
        res.status(401).json({ message: 'Token inválido' });
    }
});

export default router;
