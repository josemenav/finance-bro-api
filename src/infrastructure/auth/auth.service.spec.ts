import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupUserDto } from './dto/auth.dto';
import { compare, hash } from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(), 
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService); 
  });

  describe('signup', () => {
    it('should create a user and return the created user', async () => {
      const mockDate = new Date('2025-01-19T21:06:26.676Z');
      jest.useFakeTimers().setSystemTime(mockDate);

      const mockUser: SignupUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      (hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockCreatedUser = {
        id: 'test-uuid',
        name: mockUser.name,
        email: mockUser.email,
        password: hashedPassword,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockCreatedUser);

      const result = await authService.signup(mockUser);

      expect(hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          id: expect.any(String),
          name: mockUser.name,
          email: mockUser.email,
          password: hashedPassword,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('login', () => {
    it('Should validate an user credentials and return the data with the JWT', async () => {
      const mockDate = new Date('2025-01-19T21:06:26.676Z');
      jest.useFakeTimers().setSystemTime(mockDate);
      
      const mockUser: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      }
  
      const hashedPassword = 'hashedPassword123'
      
      const mockFoundUser = {
        id: 'test-uuid',
        name: 'Test User',
        email: mockUser.email,
        password: hashedPassword,
        createdAt: mockDate,
        updatedAt: mockDate,
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockFoundUser);
      (compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');
      
      const result = await authService.login(mockUser);

      expect(compare).toHaveBeenCalledWith(mockUser.password, hashedPassword)
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: {email: mockUser.email}
      })
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockFoundUser.id, 
        email: mockFoundUser.email
      })
      expect(result).toEqual({
        user: mockFoundUser, 
        token: 'mockToken'
      }); 
    })
  })
});
