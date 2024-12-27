import { Controller, Param, Query, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { Post, Body, Get } from '@nestjs/common';
import { NotImplementedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    async getUser(@Query('email') email: string) {
        return await this.userService.getUserByEmail(email);
    }
    
    @Post('signup')
    async signup(@Body() user: CreateUserDto) {
        return await this.userService.createUser(user);
    }
}
