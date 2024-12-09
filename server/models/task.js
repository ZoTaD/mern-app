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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Creo el modelo basado en el esquema
const Task = mongoose.model('Task', taskSchema);

export default Task;
