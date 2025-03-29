import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { BcryptPasswordHashingService } from '../services/bcrypt-password-hashing.service';

@Module({
  providers: [UsersService, BcryptPasswordHashingService],
  exports: [UsersService],
})
export class AuthModule {}
