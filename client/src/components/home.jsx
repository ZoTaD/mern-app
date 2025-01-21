import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskManager from './TaskManager';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';

function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const userResponse = await axios.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(userResponse.data.name);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6" />
              <h1 className="text-2xl font-semibold">Bienvenido {name}</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Gestión de tareas</h2>
          <TaskManager />
        </div>
      </main>
    </div>
  );
}

export default Home;