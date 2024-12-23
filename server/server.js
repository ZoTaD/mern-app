import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
dotenv.config();


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MongoDB URI no está definido en las variables de entorno.");
  process.exit(1);
}


const app = express();
app.use(cors()); // Permitir conexiones desde el frontend
app.use(express.json()); // Parsear JSON en las peticiones

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));


// Registro de rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/user', userRoutes);


app.get('/api/health', (req, res) => {
    res.send('Server is running');
});

// Defino una ruta de la raíz
app.get('/', (req, res) => {
    res.send('¡Mi aplicacion mern!');
});

// Levantar el servidor en el puerto definido en el archivo .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

