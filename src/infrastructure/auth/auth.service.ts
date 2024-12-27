import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { PrismaService } from '../database/prisma.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private prismaService: PrismaService) {}

    async login(requestData: LoginDto) {
        const findUser = await this.prismaService.user.findUnique({ where: {email: requestData.email} });
        if(!findUser) {
            throw new HttpException('User not found', 404);
        }
        const checkPassword = await compare(requestData.password, findUser.password);
        if(!checkPassword) {
            throw new HttpException('Invalid password', 401);
        }
        return findUser;
    }
}

