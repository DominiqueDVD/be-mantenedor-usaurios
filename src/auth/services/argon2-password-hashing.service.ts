import * as argon2 from 'argon2';
import { IPasswordHashingService } from 'src/interface/password-hashing.interface';

export class Argon2PasswordHashingService implements IPasswordHashingService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }
}
