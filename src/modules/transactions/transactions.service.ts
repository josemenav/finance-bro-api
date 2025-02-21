import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/transactions.dto';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from './domain/Transaction';


@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}

  async createTransaction(transaction: any) {
    try {
        const date = new Date();
        const newTransaction: Transaction = {
            id : uuidv4(),
            userId: transaction.userId,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description || '',
            date: date,
            updatedAt: date,
        };
        
        const data = await this.prismaService.transaction.create({ data: newTransaction });
        console.log('TransactionsService.create response from database: ', data);
        return { message: 'Transaction created successfully', data: data };
    } catch (error) {
        console.error('Database error:', error);
        throw new HttpException('Error creating transaction', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTransactions(userId: string, page: number = 1, type?: string | undefined) {	
    try {
      const limit: number = 10;
      const skip = (page - 1) * limit;
      const whereCondition: { userId: string; type?: string } = {
        userId: userId,
      };
      if (type !== undefined) {
        whereCondition.type = type;
      }
      const transactions = await this.prismaService.transaction.findMany({
        where: {
          ...whereCondition,
        },
        orderBy: {
          date: 'desc',
        },
        skip: skip,
        take: limit,
      });
      const totalTransactions = await this.prismaService.transaction.count({
        where: {
          ...whereCondition,
        },
      });
      return {
        data: transactions,
        meta: {
          total: totalTransactions,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalTransactions / limit),
        },
      };
    } catch (error) {
      console.error('Database error:', error);
      throw new HttpException('Error fetching transactions', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async updateTransaction(transaction: any){
    try {
      const date = new Date();
      const updatedTransaction = {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || '',
        updatedAt: date,
      };
      const data = await this.prismaService.transaction.update({
        where: {
          id: transaction.id,
          userId: transaction.userId
        },
        data: updatedTransaction,
      });
      console.log('TransactionsService.updateTransaction response from database: ', data);
      return { message: 'Transaction updated successfully', data: data };
    } catch (error) {
      console.error('Database error:', error);
      throw new HttpException('Error updating transaction', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteTransaction(transactionId: string, userId: string) {
    try {
      const data = await this.prismaService.transaction.delete({
        where: {
          id: transactionId,
          userId: userId
        }
      });
      console.log('TransactionsService.deleteTransaction response from database: ', data);
      return { message: 'Transaction deleted successfully', data: data };
    } catch (error) {
      console.error('Database error:', error);
      throw new HttpException('Error deleting transaction', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
