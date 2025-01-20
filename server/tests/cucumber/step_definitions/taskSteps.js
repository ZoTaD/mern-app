import { Given, When, Then, defineParameterType } from '@cucumber/cucumber';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';

chai.use(chaiHttp);
const expect = chai.expect;

let token = null;
let response = null;
let taskId = null;

defineParameterType({
    name: 'taskId',
    regexp: /[\w-]+/, // Coincide con IDs alfanuméricos y guiones
    transformer: s => s, // Devuelve el valor capturado sin modificaciones
});


// Autenticación con un usuario válido
Given('estoy autenticado con mi cuenta', async function () {
    const res = await chai.request(app).post('/api/auth/login').send({
        email: 'nico@gmail.com',
        password: '123456',
    });
    token = res.body.token;
    expect(res.status).to.equal(200);
    expect(token).to.be.a('string');
});

// Crear una tarea existente
Given('existe una tarea con título {string} en la base de datos', async function (taskTitle) {
    const task = {
        title: taskTitle,
        description: 'Descripción de la tarea existente',
        status: 'Pendiente',
    };

    const res = await chai
        .request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(task);

    taskId = res.body._id;
    expect(res.status).to.equal(201);
    expect(taskId).to.exist;
});

// Crear una nueva tarea
When('envío una solicitud POST al endpoint {string} con los datos:', async function (endpoint, dataTable) {
    const data = dataTable.hashes()[0];

    response = await chai
        .request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(data);

    console.log('Respuesta del servidor:', response.body);
});

// Editar una tarea
When('envío una solicitud PUT al endpoint "\\/api\\/tasks\\/{taskId}" con los datos:', async function (taskId, dataTable) {
    const dynamicEndpoint = `/api/tasks/${taskId}`;
    const data = dataTable.hashes()[0];

    response = await chai
        .request(app)
        .put(dynamicEndpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(data);

    console.log('Respuesta del servidor al editar:', response.body);
});


// Eliminar una tarea
When('envío una solicitud DELETE al endpoint "\\/api\\/tasks\\/{taskId}"', async function (taskId) {
    const dynamicEndpoint = `/api/tasks/${taskId}`;

    response = await chai
        .request(app)
        .delete(dynamicEndpoint)
        .set('Authorization', `Bearer ${token}`);

    console.log('Respuesta del servidor al eliminar:', response.body);
});


// Validar respuesta genérica
Then('debería recibir una respuesta con código {int}', function (statusCode) {
    expect(response).to.have.status(statusCode);
    if (response.status !== statusCode) {
        console.error('Error en la respuesta:', response.body);
    }
});

// Validar respuesta con datos actualizados
Then('debería recibir una respuesta con código {int} y los datos actualizados', function (statusCode) {
    expect(response).to.have.status(statusCode);
    expect(response.body._id).to.equal(taskId);
    expect(response.body.title).to.equal('Tarea actualizada');
    expect(response.body.description).to.equal('Descripción actualizada');
    expect(response.body.status).to.equal('En Progreso');
});
