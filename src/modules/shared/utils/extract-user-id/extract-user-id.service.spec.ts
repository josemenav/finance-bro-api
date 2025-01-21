import { Test, TestingModule } from '@nestjs/testing';
import { ExtractUserIdService } from './extract-user-id.service';

describe('ExtractUserIdService', () => {
  let service: ExtractUserIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtractUserIdService],
    }).compile();

    service = module.get<ExtractUserIdService>(ExtractUserIdService);
  });

  it('should return the users id', () => {
    const mockUserReq = {
      userId: 'mock-user-uuid',
      userEmail: 'mock.user@gmail.com'
    }

    jest.spyOn(service, 'getUserId').mockReturnValue('mock-user-uuid')
    const result = service.getUserId(mockUserReq)
    
    expect(result).toEqual(mockUserReq.userId);
  });
});
