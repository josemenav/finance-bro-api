import { Body, Controller, HttpCode, NotImplementedException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() requestData: LoginDto) {
        return this.authService.login(requestData);
    }

}
