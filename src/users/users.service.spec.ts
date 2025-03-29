import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Phone } from './entities/phone.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockPhoneRepository = {
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let phoneRepository: Repository<Phone>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersController,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Phone),
          useValue: mockPhoneRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    phoneRepository = module.get<Repository<Phone>>(getRepositoryToken(Phone));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException if required fields are missing', async () => {
      const createUserDto = { email: '', name: '', password: '', phones: [] };
      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email is already registered', async () => {
      const createUserDto = { email: 'test@example.com', name: 'Test', password: 'Password1', phones: [] };

      mockUserRepository.findOne = jest.fn().mockResolvedValue({ email: 'test@example.com' });

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should create and return a user with token', async () => {
      const createUserDto = { email: 'test@example.com', name: 'Test', password: 'Password1', phones: [] };
      
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null); 
      mockUserRepository.create = jest.fn().mockReturnValue(createUserDto);
      mockUserRepository.save = jest.fn().mockResolvedValue(createUserDto);
      jwtService.sign = jest.fn().mockReturnValue('jwt_token');
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_password');

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('token', 'jwt_token');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'nonexistent-id';
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
    });

    it('should return the user data if found', async () => {
      const userId = 'valid-id';
      const user = { id: userId, name: 'Test', email: 'test@example.com', phones: [], token: 'jwt_token' };
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await service.findById(userId);

      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('token', 'jwt_token');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const userId = 'nonexistent-id';
      mockUserRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.delete(userId)).rejects.toThrow(NotFoundException);
    });

    it('should deactivate the user and return success message', async () => {
      const userId = 'valid-id';
      const user = { id: userId, name: 'Test', email: 'test@example.com', isActive: true };
      mockUserRepository.findOne = jest.fn().mockResolvedValue(user);
      mockUserRepository.save = jest.fn().mockResolvedValue({ ...user, isActive: false });

      const result = await service.delete(userId);

      expect(result).toHaveProperty('mensaje', 'Usuario eliminado con éxito');
    });
  });
});
