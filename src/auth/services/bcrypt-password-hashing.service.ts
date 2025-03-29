import * as bcrypt from 'bcrypt';
import { IPasswordHashingService } from '../../interface/password-hashing.interface';

export class BcryptPasswordHashingService implements IPasswordHashingService {
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error en el hashing de la contraseña:', error.message);
        throw new Error('Error al generar el hash de la contraseña');
      }
      throw error;
    }
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al comparar las contraseñas:', error.message);
        throw new Error('Error al comparar las contraseñas');
      }
      throw error;
    }
  }
}
