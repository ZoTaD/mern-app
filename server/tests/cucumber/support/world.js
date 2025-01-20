import { setWorldConstructor } from '@cucumber/cucumber';

class CustomWorld {
  constructor() {
    this.user = null; // Aca puedo almacenar un usuario autenticado
    this.token = null; // Aca guardo el token JWT
  }
}

setWorldConstructor(CustomWorld);
