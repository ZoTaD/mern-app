import mongoose from 'mongoose';

// Defino el esquema para una Tarea
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Pendiente', 'En Progreso', 'Completada'],
    default: 'Pendiente',
    required: true,
  },
  order: {
    type: Number, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Creo el modelo basado en el esquema
const Task = mongoose.model('Task', taskSchema);

export default Task;
