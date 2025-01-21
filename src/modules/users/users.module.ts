import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { ExtractUserIdService } from '../shared/utils/extract-user-id/extract-user-id.service';

@Module({
  providers: [UsersService, PrismaService, ExtractUserIdService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
