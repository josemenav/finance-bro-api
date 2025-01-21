import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupUserDto, LoginDto } from "./dto/auth.dto";


describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signup: jest.fn(),
                        login: jest.fn(),
                    }
                },
            ]
        }).compile();
        
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    })

    describe('signup', () => {
        it('Should call AuthService.signup with the correct data and return the result', async () => {
            const mockDate = new Date('2025-01-19T21:06:26.676Z');
            jest.useFakeTimers().setSystemTime(mockDate);
            
            const mockUser: SignupUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            };
        
            const mockCreatedUser = {
                id: 'test-uuid',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword123',
                createdAt: mockDate,
                updatedAt: mockDate,
            };

            jest.spyOn(authService, 'signup').mockResolvedValue(mockCreatedUser); 

            const result = await authController.signup(mockUser); 

            expect(authService.signup).toHaveBeenCalledWith(mockUser); 
            expect(result).toEqual(mockCreatedUser); 
        })
    })

    describe('login', () => {
        it('It should call the AuthService.login to validate the credentials and return the users data and JWT', async () => {
            const mockDate = new Date('2025-01-19T21:06:26.676Z');
            jest.useFakeTimers().setSystemTime(mockDate);
            
            const mockUser: LoginDto = {
                email: 'test@example.com',
                password: 'password123',
            };
        
            const mockFoundUser = {
                id: 'test-uuid',
                name: 'Test User',
                email: 'test@example.com',
                password: 'hashedPassword123',
                createdAt: mockDate,
                updatedAt: mockDate,
            };
            
            jest.spyOn(authService, 'login').mockResolvedValue({
                user: mockFoundUser,
                token: 'mockToken'
            })

            const result = await authController.login(mockUser); 

            expect(authService.login).toHaveBeenCalledWith(mockUser)
            expect(result).toEqual({
                user: mockFoundUser,
                token: 'mockToken'
            })
        })
    })
})