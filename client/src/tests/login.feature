Feature: Login
  Como usuario
  Quiero iniciar sesión en la aplicación
  Para poder acceder a mis tareas

  Scenario: Iniciar sesión con credenciales válidas
    Given estoy en la página de login
    When ingreso el email "test@example.com"
    And ingreso la contraseña "password123"
    And hago clic en el botón de iniciar sesión
    Then debería ser redirigido a la página de inicio

  Scenario: Iniciar sesión con credenciales inválidas
    Given estoy en la página de login
    When ingreso el email "test@example.com"
    And ingreso la contraseña "wrongpassword"
    And hago clic en el botón de iniciar sesión
    Then debería ver un mensaje de error "Error al iniciar sesión"
