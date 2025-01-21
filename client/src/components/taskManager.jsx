import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/taskSlice';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

function TaskManager() {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const taskToCreate = {
      ...newTask,
      status: newTask.status || 'Pendiente',
    };
    dispatch(createTask(taskToCreate));
    setNewTask({ title: '', description: '', status: 'Pendiente' });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const updatedTask = { ...newTask };
    await dispatch(updateTask({ id: editingTask._id, data: updatedTask }));
    setEditingTask(null);
    setNewTask({ title: '', description: '', status: 'Pendiente' });
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description, status: task.status });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const task = groupedTasks[source.droppableId][source.index];
      const updatedTask = {
        ...task,
        status: destination.droppableId,
      };
      dispatch(updateTask.fulfilled(updatedTask));
      dispatch(updateTask({ id: task._id, data: updatedTask }));
    }
  };

  const groupedTasks = {
    Pendiente: tasks.filter((task) => task.status === 'Pendiente'),
    'En Progreso': tasks.filter((task) => task.status === 'En Progreso'),
    Completada: tasks.filter((task) => task.status === 'Completada'),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return 'bg-red-100 text-red-800';
      case 'En Progreso': return 'bg-yellow-100 text-yellow-800';
      case 'Completada': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                type="text"
                placeholder="Título"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Descripción"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Progreso">En Progreso</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {editingTask ? 'Actualizar' : 'Agregar'}
                </Button>
                {editingTask && (
                  <Button variant="outline" onClick={() => setEditingTask(null)}>
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Pendiente', 'En Progreso', 'Completada'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-background rounded-lg p-4 min-h-[500px]"
                >
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    <Badge variant="outline" className={getStatusColor(status)}>
                      {status}
                    </Badge>
                  </h3>
                  <div className="space-y-4">
                    {groupedTasks[status].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="shadow-sm hover:shadow-md transition-shadow"
                          >
                            <CardHeader>
                              <CardTitle className="text-base">
                                <span className="text-muted-foreground text-sm mr-2">#{index + 1}</span>
                                {task.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                Creado el: {formatDate(task.createdAt)}
                              </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(task)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setTaskToDelete(task._id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                Eliminar
                              </Button>
                            </CardFooter>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. La tarea será eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DragDropContext>
  );
}

export default TaskManager;