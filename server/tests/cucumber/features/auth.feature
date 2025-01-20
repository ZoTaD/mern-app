Feature: Autenticación de usuarios
  Como usuario
  Quiero registrarme e iniciar sesión
  Para acceder a las funcionalidades de la aplicación

Scenario: Registro de usuario exitoso
  Given un email "test@example.com" y un username "testuser" y una contraseña "123456"
  When envío una solicitud POST al endpoint "/api/auth/register"
  Then debería recibir un mensaje "Usuario creado"

Scenario: Registro de usuario duplicado
  Given un email "test@example.com" y un username "testuser" y una contraseña "123456"
  When envío una solicitud POST al endpoint "/api/auth/register"
  Then debería recibir un mensaje "El usuario ya existe"

Scenario: Login con credenciales válidas
  Given un usuario existente con email "test@example.com" y contraseña "123456"
  When envío una solicitud POST al endpoint "/api/auth/login"
  Then debería recibir un token JWT
