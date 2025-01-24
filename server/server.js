import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'; 
import rateLimit from 'express-rate-limit'; 
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import axios from 'axios';

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

// Usar Helmet para proteger la app con cabeceras HTTP seguras
app.use(helmet());

// Configurar el límite de solicitudes para prevenir ataques DoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo de 100 solicitudes por IP
    message: "Demasiadas solicitudes desde esta IP, por favor inténtalo de nuevo después de un tiempo."
});
app.use(limiter);

app.use((req, res, next) => {
    console.log(`Solicitud recibida de origen: ${req.headers.origin}`);
    next();
});

// Middleware para parsear JSON
app.use(express.json());
console.log("hola");

// Configuración de CORS
app.use(cors({
    origin: 'https://blomernapp.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.options('*', cors());

axios.interceptors.request.use((request) => {
    console.log("Solicitud:", request);
    return request;
});

axios.interceptors.response.use(
    (response) => {
        console.log("Respuesta:", response);
        return response;
    },
    (error) => {
        console.error("Error en respuesta:", error.response || error.message);
        return Promise.reject(error);
    }
);

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

export default app;
