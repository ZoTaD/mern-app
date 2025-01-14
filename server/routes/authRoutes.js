import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Endpoint para verificar disponibilidad de email y usuario
router.post('/check-user', async (req, res) => {
    const { email, username } = req.body;

    try {
        // Verificar si el email o el nombre de usuario ya existen
        const emailExists = await User.findOne({ email });
        const usernameExists = await User.findOne({ username });

        res.status(200).json({
            emailExists: !!emailExists,
            usernameExists: !!usernameExists,
        });
    } catch (error) {
        console.error('Error al verificar email o usuario:', error);
        res.status(500).json({ message: 'Error al verificar disponibilidad' });
    }
});

// Registro de usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});


// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Datos recibidos para login:', { email, password }); // Log para depuración

    try {
        // Buscar al usuario por email
        const user = await User.findOne({ email });

        if (!user) {
            console.warn('Usuario no encontrado.');
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.warn('Contraseña incorrecta.');
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar el token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

export default router;
