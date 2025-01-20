Feature: Registro
  Como nuevo usuario
  Quiero registrarme en la aplicación
  Para poder iniciar sesión

  Scenario: Registro exitoso
    Given estoy en la página de registro
    When ingreso el nombre de usuario "testuser"
    And ingreso el email "prueba123@gmail.com"
    And ingreso la contraseña "123456"
    And hago clic en el botón de registrarse
    Then debería ser redirigido al login con el mensaje "Registro exitoso. Por favor, inicia sesión."

  Scenario: Registro fallido con email inválido
    Given estoy en la página de registro
    When ingreso el nombre de usuario "testuser"
    And ingreso el email "correo-invalido"
    And ingreso la contraseña "123456"
    And hago clic en el botón de registrarse
    Then debería ver un mensaje de error "Por favor, ingresa un email válido."

  Scenario: Registro fallido con usuario vacío
    Given estoy en la página de registro
    When ingreso el nombre de usuario ""
    And ingreso el email "prueba123@gmail.com"
    And ingreso la contraseña "123456"
    And hago clic en el botón de registrarse
    Then debería ver un mensaje de error "El campo usuario es obligatorio."

  Scenario: Registro fallido con contraseña demasiado corta
    Given estoy en la página de registro
    When ingreso el nombre de usuario "testuser"
    And ingreso el email "prueba123@gmail.com"
    And ingreso la contraseña "123"
    And hago clic en el botón de registrarse
    Then debería ver un mensaje de error "La contraseña debe tener al menos 6 caracteres."
