import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { Transaction } from './domain/Transaction';


describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService, 
        {
          provide: PrismaService,
          useValue: {
            transaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new transaction record', async () => {
      const mockDate = new Date('2025-01-19T21:06:26.676Z');
      jest.useFakeTimers().setSystemTime(mockDate);

      const mockTransaction = {
        userId: 'test-user-uuid',
        type: 'expense',
        amount: 100,
        description: 'Test transaction',
        category: 'Test category',
      };

      const mockTransactionResponse = {
        id: expect.any(String),
        userId: 'test-user-uuid',
        type: 'expense',
        amount: 100,
        description: 'Test transaction',
        category: 'Test category',
        date: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      jest.spyOn(prismaService.transaction, 'create').mockResolvedValue(mockTransactionResponse);

      const response = await service.createTransaction(mockTransaction);
      expect(prismaService.transaction.create).toHaveBeenCalledWith({ data: mockTransactionResponse });
      expect(response).toEqual({ message: 'Transaction created successfully', data: {
        id: expect.any(String),
        userId: 'test-user-uuid',
        type: 'expense',
        amount: 100,
        description: 'Test transaction',
        category: 'Test category',
        date: expect.any(Date),
        updatedAt: expect.any(Date),
      }});
    });
  });
  
  describe('get', () => {
    it('should return paginated transactions with metadata', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: 'test-transaction-uuid-1',
          userId: 'test-user-uuid',
          type: 'expense',
          amount: 100,
          description: 'Test transaction 1',
          category: 'Test category 1',
          date: new Date('2025-01-19T21:06:26.676Z'),
          updatedAt: new Date('2025-01-19T21:06:26.676Z'),
        },
        {
          id: 'test-transaction-uuid-2',
          userId: 'test-user-uuid',
          type: 'expense',
          amount: 200,
          description: 'Test transaction 2',
          category: 'Test category 2',
          date: new Date('2025-01-19T21:06:26.676Z'),
          updatedAt: new Date('2025-01-19T21:06:26.676Z'),
        },
      ];
  
      const totalTransactions = 2;
      const page = 1;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(mockTransactions);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(totalTransactions);
  
      const response = await service.getTransactions('test-user-uuid', page);
  
      expect(prismaService.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'test-user-uuid',
        },
        orderBy: {
          date: 'desc',
        },
        skip: skip,
        take: limit,
      });
      expect(prismaService.transaction.count).toHaveBeenCalledWith({
        where: {
          userId: 'test-user-uuid',
        },
      });
      expect(response).toEqual({
        data: mockTransactions,
        meta: {
          total: totalTransactions,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalTransactions / limit),
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing transaction for a specific user', async () => {
      const mockDate = new Date('2025-01-19T21:06:26.676Z');
      jest.useFakeTimers().setSystemTime(mockDate);
    
      const mockTransaction = {
        id: 'test-transaction-uuid-1',
        userId: 'test-user-uuid',
        type: 'expense',
        amount: 100,
        description: 'Test transaction 2',
        category: 'Test category 2',
      };
    
      const mockUpdatedTransaction = {
        message: 'Transaction updated successfully',
        data: {
          id: 'test-transaction-uuid-1',
          userId: 'test-user-uuid',
          type: 'expense',
          amount: 100,
          description: 'Test transaction 2',
          category: 'Test category 2',
          date: mockDate,
          updatedAt: mockDate,
        },
      };
    
      jest.spyOn(prismaService.transaction, 'update').mockResolvedValue(mockUpdatedTransaction.data);
    
      const response = await service.updateTransaction(mockTransaction);
      expect(prismaService.transaction.update).toHaveBeenCalledWith({
        where: {
          id: mockTransaction.id,
          userId: mockTransaction.userId,
        },
        data: {
          type: mockTransaction.type,
          amount: mockTransaction.amount,
          category: mockTransaction.category,
          description: mockTransaction.description || '',
          updatedAt: mockDate,
        },
      });
      expect(response).toEqual(mockUpdatedTransaction);
    })
  });

  describe('delete', () => {
    it('should delete an existing transaction for a specific user', async () => {
      const mockedTransactionId = 'test-transaction-uuid-1';
      const mockedUserId = 'test-user-uuid';

      const mockedDeletedTransaction = {
        id: mockedTransactionId,
        userId: mockedUserId,
        type: 'expense',
        amount: 100,
        description: 'Test transaction 1',
        category: 'Test category 1',
        date: new Date('2025-01-19T21:06:26.676Z'),
        updatedAt: new Date('2025-01-19T21:06:26.676Z'),
      }

      jest.spyOn(prismaService.transaction, 'delete').mockResolvedValue(mockedDeletedTransaction);
      const response = await service.deleteTransaction(mockedTransactionId, mockedUserId);
      expect(prismaService.transaction.delete).toHaveBeenCalledWith({
        where: {
          id: mockedTransactionId,
          userId: mockedUserId,
        },
      });
      expect(response).toEqual({ message: 'Transaction deleted successfully', data: mockedDeletedTransaction });  

    });
  });



});
