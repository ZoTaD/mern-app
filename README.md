# Proyecto MERN - Administrador de Tareas

Este proyecto es un **Administrador de Tareas** desarrollado con el stack MERN (**MongoDB, Express, React, Node.js**). Su propósito es permitir a los usuarios gestionar tareas mediante una interfaz intuitiva, con funcionalidades como arrastrar y soltar, edición y eliminación de tareas, protegidas mediante autenticación JWT.

El frontend se despliega en **Netlify**, el backend en **Heroku**, y la base de datos en **MongoDB Atlas**, garantizando un entorno escalable y moderno.

---

## Tecnologías Utilizadas

### Frontend

- **React**: Para la creación de la interfaz interactiva.
- **Axios**: Para manejar las solicitudes HTTP al backend.
- **Bootstrap**: Diseño responsivo y estilizado.
- **SweetAlert2**: Alertas dinámicas y elegantes.
- **Redux & Redux Thunk**: Para el manejo del estado global y acciones asíncronas.
- **React Beautiful DnD**: Para implementar la funcionalidad de arrastrar y soltar en las tareas.
- Desplegado en **Netlify**.

### Backend

- **Node.js**: Entorno para ejecutar JavaScript en el servidor.
- **Express**: Framework para estructurar y manejar rutas y middlewares.
- **Mongoose**: Interfaz ODM para conectarse y trabajar con MongoDB.
- **JWT**: Autenticación segura mediante tokens.
- **bcryptjs**: Para hash seguro de contraseñas.
- **dotenv**: Manejo seguro de variables de entorno.
- Desplegado en **Heroku**.

### Base de Datos

- **MongoDB Atlas**: Base de datos NoSQL en la nube, optimizada para grandes volúmenes de datos.

---

## Características Principales

1. **Gestión de Tareas**:

   - Crear, editar, eliminar y mover tareas entre columnas (Pendiente, En Progreso, Completada).
   - Interacción fluida con soporte para arrastrar y soltar.

2. **Autenticación y Seguridad**:

   - Registro de usuarios.
   - Inicio de sesión con **JWT**.
   - Middleware para proteger rutas y validar usuarios.

3. **Interfaz Moderna**:

   - Diseño responsivo con Bootstrap.
   - Alertas dinámicas para confirmaciones.

4. **Despliegue y Escalabilidad**:

   - Frontend desplegado en **Netlify**.
   - Backend en **Heroku**.
   - Base de datos gestionada en **MongoDB Atlas**.

5. **Pruebas Automatizadas**:

   - Pruebas completas de los endpoints y funcionalidad del frontend utilizando **Jest** y mocks de datos.

---

## Dependencias y Justificación

### Backend

- **Express**: Framework robusto para manejar solicitudes y middlewares.
- **Mongoose**: Permite trabajar con MongoDB usando un esquema claro.
- **JWT**: Implementa un sistema de autenticación confiable.
- **bcryptjs**: Asegura las contraseñas mediante hashing.
- **dotenv**: Protege información sensible como claves y URIs.
- **CORS**: Permite la interacción segura entre frontend y backend.

### Frontend

- **React**: Base para crear interfaces modernas y reactivas.
- **Axios**: Simplifica las solicitudes HTTP al backend.
- **Redux**: Facilita la gestión del estado global en aplicaciones complejas.
- **React Beautiful DnD**: Mejora la experiencia del usuario al permitir arrastrar tareas.
- **SweetAlert2**: Alertas atractivas para confirmaciones.

---

## Flujo de Trabajo

### Registro de Usuario

1. El usuario completa un formulario de registro en el frontend.
2. **Axios** envía una solicitud POST al backend en `/api/auth/register`.
3. El backend utiliza **bcryptjs** para hashear la contraseña y almacena al usuario en MongoDB Atlas mediante **Mongoose**.
4. Respuesta con un mensaje de éxito al frontend.

### Inicio de Sesión

1. El usuario ingresa sus credenciales en el formulario de login.
2. **Axios** realiza una solicitud POST a `/api/auth/login` con email y contraseña.
3. El backend valida las credenciales:
   - Si son válidas, genera un **JWT** usando **jsonwebtoken** y lo devuelve.
   - Si son inválidas, responde con un error `401`.
4. El frontend almacena el **JWT** en localStorage y actualiza el estado global con **Redux**.

### Gestión de Tareas

#### Crear Tarea

1. El usuario envía una solicitud POST al endpoint `/api/tasks` con los datos de la tarea:
   ```json
   {
       "title": "Nueva Tarea",
       "description": "Descripción de la tarea",
       "status": "Pendiente"
   }
   ```
2. El middleware de autenticación verifica el token enviado en los headers.
3. El backend almacena la tarea en MongoDB y la asocia al usuario autenticado.
4. Respuesta con la tarea creada.

#### Leer Tareas

1. El frontend realiza una solicitud GET a `/api/tasks`.
2. El middleware verifica el token.
3. El backend consulta MongoDB y devuelve las tareas del usuario autenticado.
4. El estado global en **Redux** se actualiza con las tareas obtenidas.

#### Actualizar Tarea

1. El usuario modifica los datos de una tarea y envía una solicitud PUT a `/api/tasks/:id`.
2. El middleware valida el token y verifica que la tarea pertenezca al usuario.
3. El backend actualiza los campos especificados en MongoDB.
4. Respuesta con la tarea actualizada y actualización del estado global en **Redux**.

#### Eliminar Tarea

1. El usuario envía una solicitud DELETE a `/api/tasks/:id`.
2. El middleware valida el token y la propiedad de la tarea.
3. El backend elimina la tarea de MongoDB.
4. Respuesta con un mensaje de éxito y eliminación del estado global.

---

## Instalación y Ejecución

### Requisitos

- **Node.js** instalado.
- Cuenta activa en **MongoDB Atlas** o instancia local de MongoDB.
- Configuración de variables de entorno en un archivo `.env`.

### Configuración del Backend

1. Navegar a la carpeta del backend:
   ```bash
   cd server
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Configurar el archivo `.env`:
   ```plaintext
   MONGO_URI=mongo-uri
   JWT_SECRET=clave-secreta
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

## Estructura del Proyecto

```
root/
│
├── server/          # Backend
│   ├── models/      # Modelos de MongoDB
│   ├── routes/      # Endpoints de la API
│   ├── middleware/  # Middleware de autenticación
│   └── server.js    # Configuración principal
│
├── client/          # Frontend
│   ├── src/
│   │   ├── components/  # Componentes de React
│   │   ├── store/       # Redux slices
│   │   └── App.js       # Punto de entrada
│   └── public/          # Archivos estáticos
│
├── .env             # Variables de entorno
├── package.json     # Dependencias del proyecto
└── README.md        # Documentación
```

---

## Despliegue

1. **Frontend**: Se desplegó en **Netlify** con soporte para rutas personalizadas.
2. **Backend**: Implementado en **Heroku** con configuración de variables de entorno.
3. **Base de Datos**: Gestionada en **MongoDB Atlas**, optimizando consultas y almacenamiento.

---

## Pruebas Automatizadas

Se configuraron pruebas unitarias para todas las funciones principales usando **Jest**. Esto incluye:

- **Autenticación**: Validación de tokens y middleware.
- **CRUD de Tareas**: Pruebas de endpoints y acciones de Redux.
- **Frontend**: Simulación de interacciones del usuario y validación del estado global.


