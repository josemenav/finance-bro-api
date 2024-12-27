import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AuthModule } from './infrastructure/auth/auth.module';


@Module({
  imports: [UsersModule, TransactionsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
