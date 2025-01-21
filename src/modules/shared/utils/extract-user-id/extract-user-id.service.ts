import { Injectable, NotImplementedException } from '@nestjs/common';
import { AuthenticatedUserDto } from '../../dto/AuthenticatedUser.dto';

@Injectable()
export class ExtractUserIdService {
    getUserId(user: AuthenticatedUserDto){
        return user.userId
    }
}
