import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './domain/users.entity';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateUserDto } from './dto/users.dto';
import { v4 as uuidv4 } from 'uuid';
import { compare, hash } from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async createUser(user: CreateUserDto) {
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

    async getUserByEmail(email: string) {
        try {
            return this.prismaService.user.findUnique({ where: { email } });
        } catch (error) {
            console.error(error);
            return new NotFoundException('User not found');
        }
    }
}; 
