import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Cargar variables de entorno
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

console.log('Mongo URI:', process.env.MONGO_URI);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("Error: MongoDB URI no está definido en las variables de entorno.");
    process.exit(1);
}

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
app.use(cors({
    origin: ['https://blomernapp.netlify.app'], // Reemplaza con la URL correcta de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true,
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    next();
});

// Manejo de solicitudes preflight (OPTIONS) antes del registro de rutas
app.options('*', cors());

// Conexión a MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// Registro de rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);

// Endpoint para verificar el estado del servidor
app.get('/api/health', (req, res) => {
    res.send('Server is running');
});

// Ruta raíz
app.get('/', (req, res) => {
    res.send('¡Mi aplicación MERN!');
});

// Levantar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
