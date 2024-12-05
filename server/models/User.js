import mongoose from 'mongoose';
// Mongoose sirve para la conexión con MongoDB
// y de la definición de modelos para la base de datos.

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);
// Con esto creo el modelo USER y  cada user que se cree va a tener un username, email y password

export default User;