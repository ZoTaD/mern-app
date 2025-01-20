import Task from '../../../models/task.js'; // Asegúrate de la ruta correcta
import { jest } from '@jest/globals';

// Mock de la base de datos
jest.mock('../../../models/task.js');

describe('Tasks Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  // Prueba de creación de tareas
  it('Debería crear una tarea correctamente', async () => {
    const mockTaskData = { title: 'Nueva tarea', completed: false };

    // Mock para el método `create` de Mongoose
    Task.create.mockResolvedValue(mockTaskData);

    const result = await Task.create(mockTaskData);

    expect(Task.create).toHaveBeenCalledWith(mockTaskData);
    expect(result).toEqual(mockTaskData);
  });

  // Prueba para obtener todas las tareas
  it('Debería obtener todas las tareas correctamente', async () => {
    const mockTasks = [
      { id: 1, title: 'Tarea 1', completed: false },
      { id: 2, title: 'Tarea 2', completed: true },
    ];

    // Mock para el método `find` de Mongoose
    Task.find.mockResolvedValue(mockTasks);

    const result = await Task.find();

    expect(Task.find).toHaveBeenCalled();
    expect(result).toEqual(mockTasks);
  });

  // Prueba para actualizar una tarea
  it('Debería actualizar una tarea correctamente', async () => {
    const mockTaskId = '1';
    const mockUpdatedData = { title: 'Tarea actualizada', completed: true };
    const mockUpdatedTask = { id: mockTaskId, ...mockUpdatedData };

    // Mock para el método `findByIdAndUpdate` de Mongoose
    Task.findByIdAndUpdate.mockResolvedValue(mockUpdatedTask);

    const result = await Task.findByIdAndUpdate(mockTaskId, mockUpdatedData, { new: true });

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(mockTaskId, mockUpdatedData, { new: true });
    expect(result).toEqual(mockUpdatedTask);
  });

  // Prueba para eliminar una tarea
  it('Debería eliminar una tarea correctamente', async () => {
    const mockTaskId = '1';

    // Mock para el método `findByIdAndDelete` de Mongoose
    Task.findByIdAndDelete.mockResolvedValue({ id: mockTaskId });

    const result = await Task.findByIdAndDelete(mockTaskId);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith(mockTaskId);
    expect(result).toEqual({ id: mockTaskId });
  });

  // Prueba para manejar errores en el CRUD
  it('Debería manejar errores correctamente', async () => {
    const mockError = new Error('Error al interactuar con la base de datos');

    // Mock para el método `create` de Mongoose con un error
    Task.create.mockRejectedValue(mockError);

    await expect(Task.create({ title: 'Tarea fallida' })).rejects.toThrow('Error al interactuar con la base de datos');
    expect(Task.create).toHaveBeenCalledWith({ title: 'Tarea fallida' });
  });
});
