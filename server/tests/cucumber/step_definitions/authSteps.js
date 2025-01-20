import { Given, When, Then } from '@cucumber/cucumber';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server.js';

chai.use(chaiHttp);
const expect = chai.expect;

let response;


// Paso para registrar un usuario
Given('un email {string} y un username {string} y una contraseña {string}', function (email, username, password) {
  this.email = email; // Guarda el email en el contexto del mundo
  this.username = username;
  this.password = password;
});


// Paso para registrar un usuario o hacer login 
When('envío una solicitud POST al endpoint {string}', async function (endpoint) {
  const payload = endpoint.includes('/register')
  // Verifica si el endpoint es /register o /login 
    ? { email: this.email, username: this.username, password: this.password }
    : { email: this.email, password: this.password };
 // Envia la solicitud POST al endpoint con el payload
  response = await chai
  // Usa chai-http para enviar la solicitud
    .request(app)
    .post(endpoint)
    .send(payload);
});

Then('debería recibir un mensaje {string}', function (expectedMessage) {
  const expectedStatus = expectedMessage === "Usuario creado" ? 201 : 400;
  expect(response).to.have.status(expectedStatus); // Verifica códigos 201 o 400
  expect(response.body.message).to.equal(expectedMessage);
});

// Paso para login
Given('un usuario existente con email {string} y contraseña {string}', function (email, password) {
  this.email = email;
  this.password = password;
});

Then('debería recibir un token JWT', function () {
  expect(response).to.have.status(200); // Código HTTP 200 para éxito
  expect(response.body).to.have.property('token'); // Verifica que exista el token
  expect(response.body.token).to.be.a('string'); // Verifica que el token sea una cadena
});
