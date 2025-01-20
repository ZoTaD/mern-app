export default {
  transform: {
    '^.+\\.js$': 'babel-jest', // Utiliza babel-jest para transformar archivos JS
  },
  testEnvironment: 'node', // Configura el entorno de pruebas como Node.js
};
