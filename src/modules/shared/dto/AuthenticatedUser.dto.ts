import {IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AuthenticatedUserDto {
  
  @IsNotEmpty()
  @IsString()
  userId: string;
  
  @IsNotEmpty()
  @IsString()
  userEmail: string;
}