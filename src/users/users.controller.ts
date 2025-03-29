import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate as isUUID } from 'uuid';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly _user: UsersService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUserDto) {
    return this._user.create(createUsuarioDto);
  }

  @Get()
  async findAll(): Promise<any[]> {
    return this._user.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    console.log('ID recibido:', id);
    if (!id || !isUUID(id)) {
      throw new BadRequestException({ mensaje: 'ID de usuario inválido' });
    }
    try {
      return await this._user.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        mensaje: 'Error interno del servidor',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log('ID recibido para eliminar:', id); // Verifica qué ID se recibe
    if (!id || !isUUID(id)) {
      throw new BadRequestException({ mensaje: 'ID de usuario inválido' });
    }
    try {
      return await this._user.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        mensaje: 'Error interno del servidor',
      });
    }
  }
}
