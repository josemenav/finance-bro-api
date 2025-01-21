import { Injectable, NotFoundException, Get } from '@nestjs/common';
import { User } from './domain/users.entity';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { GetUserDto } from './dto/users.dto';


@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async getUserByEmail(email: string) {
        try {
            return this.prismaService.user.findUnique({ where: { email } });
        } catch (error) {
            console.error(error);
            return new NotFoundException('User not found');
        }
    }

    getUserId(user: GetUserDto) {
        try {
            const id = user.userId;
            return id;
        } catch (error) {
            console.error(error);
            return new InternalServerErrorException();
        }
    }
}; 
