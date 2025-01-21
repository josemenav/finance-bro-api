import { Controller, InternalServerErrorException, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Post, Body, Get } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';
import { ExtractUserIdService } from '../shared/utils/extract-user-id/extract-user-id.service';
import { AuthenticatedUserDto } from '../shared/dto/AuthenticatedUser.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private userService: UsersService, 
        private userUtils: ExtractUserIdService) {}
    
    
    @Get()
    async getUser(@Query('email') email: string, @Req() req: Request) {
        const id = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        console.log(id)
        return
        //return await this.userService.getUserByEmail(email);
    }
}

