Feature: Crear una tarea
  Como usuario autenticado
  Quiero crear una tarea
  Para organizar mejor mis actividades

Scenario: Crear una tarea con éxito
  Given estoy autenticado con mi cuenta
  When envío una solicitud POST al endpoint "/api/tasks" con los datos:
    | title            | description           | status    |
    | Mi primera tarea | Descripción de prueba | Pendiente |
  Then debería recibir una respuesta con código 201

Scenario: Editar una tarea
  Given estoy autenticado con mi cuenta
  And existe una tarea con título "Tarea existente" en la base de datos
  When envío una solicitud PUT al endpoint "\/api\/tasks\/{taskId}" con los datos:
    | title             | description             | status       |
    | Tarea actualizada | Descripción actualizada | En Progreso  |
  Then debería recibir una respuesta con código 200 y los datos actualizados


Scenario: Eliminar una tarea
  Given estoy autenticado con mi cuenta
  And existe una tarea con título "Tarea a eliminar" en la base de datos
  When envío una solicitud DELETE al endpoint "/api/tasks/<taskId>"
  Then debería recibir una respuesta con código 204
