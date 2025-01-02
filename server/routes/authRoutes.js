import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Creacion de endpoints
// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Guardo el usuario en la base de datos
        await newUser.save();

        // Genero el token
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });

        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error('Error en /register:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// login de Usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Datos recibidos para login:', { email, password }); // Log para debug

    try {
        const user = await User.findOne({ email });
        console.log('Usuario encontrado:', user); // Log para verificar el usuario

        if (!user) {
            console.warn('Usuario no encontrado.');
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Contraseña correcta:', isMatch); // Log para la contraseña

        if (!isMatch) {
            console.warn('Contraseña incorrecta.');
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });
        console.log('Token generado:', token); // Log para el token

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});





export default router;