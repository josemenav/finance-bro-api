import { Controller, Delete, Param, Put, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';    
import { Req } from '@nestjs/common';
import { Post, Body, Get } from '@nestjs/common';
import { AuthenticatedUserDto } from '../shared/dto/AuthenticatedUser.dto';
import { ExtractUserIdService } from '../shared/utils/extract-user-id/extract-user-id.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/transactions.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(
        private transactionsService: TransactionsService,
        private userUtils: ExtractUserIdService
    ) {}

    @Get()
    async getTransactions(@Query('page') page: number, @Req() req: any) {
        const user = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        return await this.transactionsService.getTransactions(user, page);
    }

    @Get()
    async getExpenses(@Query('page') page: number, @Query('type') type: string, @Req() req: any){
        const user = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        return await this.transactionsService.getTransactions(user, page, type);
    }

    @Get()
    async getIncomes(@Query('page') page: number, @Query('type') type: string, @Req() req: any){
        const user = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        return await this.transactionsService.getTransactions(user, page, type);
    }

    @Post()
    async createTransaction(@Body() requestData: CreateTransactionDto, @Req() req: any) {
        const user = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        const transaction = { ...requestData, userId: user }
        return await this.transactionsService.createTransaction(transaction);
    }

    @Put()
    async updateTransaction(@Body() requestData: UpdateTransactionDto, @Req() req: any) {
        const user = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        const transaction = { ...requestData, userId: user }
        return await this.transactionsService.updateTransaction(transaction);
    }

    @Delete(':id')
    async deleteTransaction(@Param('id') id: string, @Req() req: any) {
        const user = this.userUtils.getUserId(req.user as AuthenticatedUserDto)
        return await this.transactionsService.deleteTransaction(id, user);
    }
}
