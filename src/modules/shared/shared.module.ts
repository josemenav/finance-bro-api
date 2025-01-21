import { Module } from '@nestjs/common';
import { ExtractUserIdService } from './utils/extract-user-id/extract-user-id.service';

@Module({
  providers: [ExtractUserIdService]
})
export class SharedModule {}
