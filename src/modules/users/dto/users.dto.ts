import {IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}

export class GetUserDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
  