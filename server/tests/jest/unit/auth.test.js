import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock de las dependencias
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Unit Tests', () => {
  // Prueba del hashing de contraseñas
  it('Debería hashear correctamente la contraseña', async () => {
    const password = '123456';
    const hashedPassword = 'hashed123456';

    // Mock del método `bcrypt.hash`
    bcrypt.hash.mockResolvedValue(hashedPassword);

    const result = await bcrypt.hash(password, 10);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10); 
    expect(result).toBe(hashedPassword); // Verifica el resultado
  });

  // Prueba de la verificación de contraseñas
  it('Debería verificar la contraseña correctamente', async () => {
    const password = '123456';
    const hashedPassword = 'hashed123456';

    // Mock del método `bcrypt.compare`
    bcrypt.compare.mockResolvedValue(true);

    const isMatch = await bcrypt.compare(password, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword); // Verifica que se llame correctamente
    expect(isMatch).toBe(true); // Valida que la comparación sea verdadera
  });

  // Prueba de la generación de tokens JWT
  it('Debería generar un token JWT', () => {
    const payload = { id: 'user123', username: 'testuser' };
    const token = 'mockedToken';

    // Mock del método `jwt.sign`
    jwt.sign.mockReturnValue(token);

    const result = jwt.sign(payload, 'secretKey', { expiresIn: '2h' });

    expect(jwt.sign).toHaveBeenCalledWith(payload, 'secretKey', { expiresIn: '2h' }); // Valida los parámetros
    expect(result).toBe(token); // Valida el token generado
  });
});
