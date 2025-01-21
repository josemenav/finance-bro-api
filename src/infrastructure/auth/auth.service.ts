import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { PrismaService } from '../database/prisma.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { User } from '../../modules/users/domain/users.entity';
import { SignupUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private prismaService: PrismaService, 
        private jwtService: JwtService
    ) {}

    async signup(user: SignupUserDto) {
        try {
            const id = uuidv4();
            const createdAt = new Date();
            const updatedAt = new Date();
            const hashedPassword = await hash(user.password, 10);
            const newUser = new User(
                id,
                user.name,
                user.email,
                hashedPassword,
                createdAt,
                updatedAt,
            );
            return this.prismaService.user.create({ data: newUser });   
        } catch (error) {
            console.error(error);
            return new HttpException('Error creating user', 500); 
        }
    }

    async login(requestData: LoginDto) {
        const findUser = await this.prismaService.user.findUnique({ where: {email: requestData.email} });
        if(!findUser) {
            throw new HttpException('User not found', 404);
        }
        const checkPassword = await compare(requestData.password, findUser.password);
        if(!checkPassword) {
            throw new HttpException('Invalid password', 401);
        }

        const token = this.jwtService.sign({
            id: findUser.id, 
            email: findUser.email
        });

        const data = {
            user: findUser,
            token: token
        };
        
        return data;
    }
}

