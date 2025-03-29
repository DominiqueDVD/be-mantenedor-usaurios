import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Phone } from './entities/phone.entity';
import { JwtModule } from '@nestjs/jwt';
import { BcryptPasswordHashingService } from 'src/auth/services/bcrypt-password-hashing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Phone]),
    JwtModule.register({
      secret: 'clavesuperrsecreta',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, BcryptPasswordHashingService],
  exports: [UsersService],
})
export class UsersModule {}
