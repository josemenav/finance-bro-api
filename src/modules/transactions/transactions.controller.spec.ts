import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ExtractUserIdService } from '../shared/utils/extract-user-id/extract-user-id.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;
  let userUtils: ExtractUserIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            getTransactions: jest.fn(),
            createTransaction: jest.fn(),
            updateTransaction: jest.fn(),
            deleteTransaction: jest.fn(),
          }
        }, 
        {
          provide: ExtractUserIdService,
          useValue: {
            getUserId: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
    userUtils = module.get<ExtractUserIdService>(ExtractUserIdService);
  });

  describe('getTransactions', () => {
    it('should return the transactions associated to an user', async () => {
      const mockUserId = 'test-user-uuid';
      const mockPage = 1;
      const mockTransaction = [
        {
          id: 'test-uuid',
          userId: 'test-user-uuid',
          type: 'expense',
          amount: 100,
          description: 'Test transaction',
          category: 'Test category',
          date: new Date('2025-01-19T21:06:26.676Z'),
          updatedAt: new Date('2025-01-19T21:06:26.676Z'),
        }
      ];
      const mockResponse = {
        data: mockTransaction,
        meta: {
          total : 1,
          page: mockPage,
          limit: 10,
          totalPages: 1,
        },
      }

      jest.spyOn(userUtils, 'getUserId').mockReturnValue(mockUserId);
      jest.spyOn(service, 'getTransactions').mockResolvedValue({
        data: mockTransaction,
        meta: {
          total : 1,
          page: mockPage,
          limit: 10,
          totalPages: 1,
        },
      });

      const req = {
        user: {
          userId: mockUserId,
          userEmail: 'mock.user@gmail.com'
        }
      };
      
      const result = await controller.getTransactions(mockPage, req);

      expect(userUtils.getUserId).toHaveBeenCalledWith(req.user);
      expect(service.getTransactions).toHaveBeenCalledWith(mockUserId, mockPage);
      expect(result).toEqual(mockResponse);
    })
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      const mockUserId = 'test-user-uuid';
      const mockTransaction = [
        {
          id: 'test-uuid',
          userId: 'test-user-uuid',
          type: 'expense',
          amount: 100,
          description: 'Test transaction',
          category: 'Test category',
          date: new Date('2025-01-19T21:06:26.676Z'),
          updatedAt: new Date('2025-01-19T21:06:26.676Z'),
        }
      ];
    });
  });
});
