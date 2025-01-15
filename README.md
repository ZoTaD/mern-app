# Proyecto MERN - Administrador de Tareas

Este proyecto es un **Administrador de Tareas** desarrollado con el stack MERN (**MongoDB, Express, React, Node.js**). El objetivo principal fue construir una aplicación funcional que permita a los usuarios gestionar tareas (crear, editar, mover entre columnas y eliminar) con un frontend desplegado en **Netlify**, un backend en **Heroku**, y una base de datos alojada en **MongoDB Atlas**.

---

## Tecnologías Utilizadas

### Frontend
- **React**: Biblioteca principal para el desarrollo del frontend.
- **Axios**: Para realizar solicitudes HTTP al backend.
- **Bootstrap**: Para la creación rápida de una interfaz de usuario estilizada.
- **SweetAlert2**: Utilizado para mostrar alertas de confirmación elegantes y dinámicas.
- Desplegado en **Netlify**.

### Backend
- **Node.js**: Entorno principal para el backend.
- **Express**: Framework para manejar las rutas y middlewares.
- **Mongoose**: Para la conexión y gestión de la base de datos **MongoDB**.
- **JWT**: Para autenticación mediante tokens.
- **bcryptjs**: Para el hashing seguro de contraseñas.
- Desplegado en **Heroku**.

### Base de Datos
- **MongoDB Atlas**: Base de datos en la nube, utilizada para almacenar las tareas y la información de los usuarios.

---

## Características Principales

1. **Gestión de Tareas**:
   - Crear tareas con título, descripción y estado inicial.
   - Editar tareas existentes.
   - Eliminar tareas con confirmación mediante SweetAlert2.
   - Arrastrar y soltar tareas entre columnas (Pendiente, En Progreso, Completada) con efecto visual.

2. **Autenticación de Usuarios**:
   - Registro de nuevos usuarios.
   - Inicio de sesión mediante **JWT**.
   - Protección de rutas del backend con middleware de autenticación.

3. **Pruebas Locales**:
   - Durante el desarrollo, las pruebas se realizaron en un entorno local utilizando **localhost** para el backend y frontend.

4. **Estructura del Proyecto**:
   - **Frontend**: Desplegado en Netlify, conecta con el backend y gestiona el estado global con Redux.
   - **Backend**: Desplegado en Heroku, proporciona las rutas API necesarias para el funcionamiento de la aplicación.
   - **Base de datos**: MongoDB Atlas utilizada para almacenar datos de usuarios y tareas.

---

## Dependencias Utilizadas

### Backend
```json
"dependencies": {
    "axios": "^1.7.9",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.13.5"
}
```

### Frontend
- **React**: Biblioteca principal.
- **Axios**: Para solicitudes HTTP.
- **Bootstrap**: Para diseño.
- **SweetAlert2**: Para confirmaciones.
- **Redux** y **Redux Thunk**: Para manejo de estado global y acciones asíncronas.

---

## Guía de Instalación y Ejecución

### Requisitos
- **Node.js** instalado.
- Acceso a MongoDB Atlas o una instancia local de MongoDB.
- Variables de entorno configuradas en un archivo `.env`.

### Clonar el Proyecto
```bash
git clone https://github.com/tu-usuario/proyecto-mern.git
cd proyecto-mern
```

### Configuración del Backend
1. Navegar a la carpeta del backend:
   ```bash
   cd server
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo `.env` con las siguientes variables:
   ```makefile
   MONGO_URI=tu-mongo-uri
   JWT_SECRET=tu-clave-secreta
   ```
4. Iniciar el backend:
   ```bash
   npm run dev
   ```

### Configuración del Frontend
1. Navegar a la carpeta del frontend:
   ```bash
   cd client
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Iniciar el frontend:
   ```bash
   npm start
   ```

---

## Despliegue Final

- **Frontend**: Desplegado en **Netlify**.
- **Backend**: Desplegado en **Heroku**.
- **Base de Datos**: Configurada en **MongoDB Atlas**.

El despliegue final fue testeado y comprobado en diferentes navegadores y dispositivos, asegurando que la funcionalidad sea consistente y fluida.

---

## Explicación del Flujo y Funciones Principales

### Flujo de Autenticación con JWT
1. El usuario inicia sesión enviando sus credenciales (**email** y **contraseña**) al endpoint `/api/auth/login`.
2. El backend verifica las credenciales:
   - Si son correctas, genera un **JWT** (firmado con `JWT_SECRET`) y lo envía como respuesta junto con la información del usuario.
   - Si son incorrectas, devuelve un error `401 Unauthorized`.
3. El frontend almacena el **JWT** en el almacenamiento local o en cookies seguras.
4. En cada solicitud subsecuente, el **JWT** se envía en los encabezados de autorización:
   ```
   Authorization: Bearer <token>
   ```
5. El middleware de autenticación en el backend valida el **JWT**:
   - Si el token es válido, permite el acceso a la ruta protegida.
   - Si no es válido o falta, devuelve un error `401 Unauthorized`.

---

### Flujo del CRUD de Tareas

#### Crear una Tarea
1. El usuario envía una solicitud POST al endpoint `/api/tasks` con los datos de la tarea:
   ```json
   {
       "title": "Nueva Tarea",
       "description": "Descripción de la tarea",
       "status": "Pendiente"
   }
   ```
2. El backend guarda la tarea en la base de datos, asociándola al usuario autenticado.
3. Devuelve la tarea creada como respuesta.

#### Leer Todas las Tareas
1. El usuario envía una solicitud GET al endpoint `/api/tasks`.
2. El backend retorna todas las tareas asociadas al usuario autenticado.

#### Actualizar una Tarea
1. El usuario envía una solicitud PUT al endpoint `/api/tasks/:id` con los campos a actualizar:
   ```json
   {
       "description": "Descripción actualizada",
       "status": "En progreso"
   }
   ```
2. El backend verifica que la tarea pertenezca al usuario y actualiza los campos especificados.
3. Devuelve la tarea actualizada como respuesta.

#### Eliminar una Tarea
1. El usuario envía una solicitud DELETE al endpoint `/api/tasks/:id`.
2. El backend verifica que la tarea pertenezca al usuario.
3. Elimina la tarea y devuelve un mensaje de confirmación:
   ```json
   {
       "message": "Tarea eliminada correctamente"
   }
   ```
---

#### Manejo de store

El store es el punto central para gestionar el estado global en el frontend utilizando Redux. Centraliza toda la información relevante de la aplicación, como las tareas del usuario autenticado y el estado de la autenticación.

  ```
   import { configureStore } from '@reduxjs/toolkit';
   import tasksReducer from './taskSlice';
   import authReducer from './authSlice';

   const store = configureStore({
      reducer: {
         tasks: tasksReducer,
         auth: authReducer,
      },
   });

   export default store;
   ```

### Funciones Clave en el Store

  - taskSlice: Maneja el estado de las tareas.
  - Acciones: fetchTasks, createTask, updateTask, deleteTask.

  - authSlice: Gestiona el estado de autenticación.
  - Acciones: login, logout, register.

  ---