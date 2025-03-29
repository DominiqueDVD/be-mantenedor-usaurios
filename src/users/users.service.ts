import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from './entities/phone.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IPasswordHashingService } from 'src/interface/password-hashing.interface';
import { BcryptPasswordHashingService } from 'src/auth/services/bcrypt-password-hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(BcryptPasswordHashingService)
    private passwordHashingService: IPasswordHashingService,
    @InjectRepository(User)
    private userEntity: Repository<User>,
    @InjectRepository(Phone)
    private phoneEntity: Repository<Phone>,
    private jwtService: JwtService,
  ) {}

  async create(createUsuarioDto: CreateUserDto) {
    const { email, name, password, phones } = createUsuarioDto;

    const existingUser = await this.userEntity.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException({
        mensaje: 'El correo ya está registrado',
      });
    }

    const hashedPassword =
      await this.passwordHashingService.hashPassword(password);

    const user = this.userEntity.create({
      name,
      email,
      password: hashedPassword,
      phones: phones.map((phone) => this.phoneEntity.create(phone)),
      lastLogin: new Date(),
    });

    const token = this.jwtService.sign({ id: user.id, email: user.email });
    user.token = token;

    await this.userEntity.save(user);

    return {
      id: user.id,
      created: user.created,
      modified: user.modified,
      last_login: user.lastLogin,
      token: user.token,
      isactive: user.isActive,
    };
  }

  async findById(id: string) {
    try {
      const user = await this.userEntity.findOne({
        where: { id },
        relations: ['phones'],
      });

      if (!user) {
        throw new NotFoundException({ mensaje: 'Usuario no encontrado' });
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phones: user.phones.map((phone) => ({
          number: phone.number,
          citycode: phone.citycode,
          countrycode: phone.countrycode,
        })),
        created: user.created ? user.created.toISOString() : null,
        modified: user.modified ? user.modified.toISOString() : null,
        last_login: user.lastLogin ? user.lastLogin.toISOString() : null,
        token: user.token,
        isactive: user.isActive,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error en findById:', error.message);
        throw new InternalServerErrorException({
          mensaje: 'Error interno del servidor',
          detalle: error.message,
          stack: error.stack,
        });
      } else {
        console.error('Error desconocido:', error);
        throw new InternalServerErrorException({
          mensaje: 'Error interno del servidor',
          detalle: 'Error desconocido',
        });
      }
    }
  }

  async delete(id: string) {
    try {
      console.log('ID recibido para eliminar:', id);

      const user = await this.userEntity.findOne({ where: { id } });

      if (!user) {
        console.warn('Usuario no encontrado');
        throw new NotFoundException({ mensaje: 'Usuario no encontrado' });
      }

      if (!user.isActive) {
        console.warn('El usuario ya fue eliminado');
        throw new BadRequestException({
          mensaje: 'El usuario ya fue eliminado',
        });
      }

      if (user.isActive === undefined || user.isActive === null) {
        console.warn('El campo isActive no está presente o es nulo');
        throw new InternalServerErrorException({
          mensaje:
            'Error al eliminar el usuario: El campo isActive no está disponible',
        });
      }

      user.isActive = false;
      await this.userEntity.save(user);

      console.log('Usuario eliminado correctamente');
      return { mensaje: 'Usuario eliminado con éxito' };
    } catch (error) {
      console.error('Error en delete:', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        mensaje: 'Error interno del servidor',
        detalle: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  async findAll() {
    try {
      const users = await this.userEntity.find({
        relations: ['phones'],
      });

      if (!users || users.length === 0) {
        throw new NotFoundException({
          mensaje: 'No se encontraron usuarios',
        });
      }

      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phones: user.phones.map((phone) => ({
          number: phone.number,
          citycode: phone.citycode,
          countrycode: phone.countrycode,
        })),
        created: user.created ? user.created.toISOString() : null,
        modified: user.modified ? user.modified.toISOString() : null,
        last_login: user.lastLogin ? user.lastLogin.toISOString() : null,
        token: user.token,
        isactive: user.isActive,
      }));
    } catch (error) {
      console.error('Error en findAll:', error);
      throw new InternalServerErrorException({
        mensaje: 'Error interno del servidor',
      });
    }
  }
}
