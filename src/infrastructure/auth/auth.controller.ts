import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { SignupUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() user: SignupUserDto) {
        return await this.authService.signup(user);
    }
    
    @Post('login')
    async login(@Body() requestData: LoginDto) {
        return this.authService.login(requestData);
    }

}
