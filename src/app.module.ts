import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { SharedModule } from './modules/shared/shared.module';


@Module({
  imports: [UsersModule, TransactionsModule, AuthModule, BudgetsModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
