import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config(); // Cargo variables de entorno

const app = express();
app.use(cors()); // Permitir conexiones desde el frontend
app.use(express.json()); // Parsear JSON en las peticiones

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mi_base_de_datos')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

app.get('/api/health', (req, res) => {
    res.send('Server is running');
});

// Defino una ruta de la raíz
app.get('/', (req, res) => {
    res.send('¡Mi aplicacion mern!');
});

// Defino rutas de prueba
// app.get('/api/login', (req, res) => {
//     const { username, password } = req.query;

//     // Verifico credenciales, esto no tiene sentido ahora mismo porque es un ejemplo
//     if (username === 'admin' && password === 'admin') {
//         res.send('Login exitoso');
//     } else {
//         res.status(401).send('Credenciales incorrectas');
//     }
// });

// Levantar el servidor en el puerto definido en el archivo .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});

