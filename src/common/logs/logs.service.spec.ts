import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { Log } from './log.schema';

describe('LogsService', () => {
  let service: LogsService;
  let mockLogModel: jest.Mock;

  beforeEach(async () => {
    // Mock the Mongoose model constructor
    mockLogModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({}),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getModelToken(Log.name),
          useValue: mockLogModel,
        },
      ],
    }).compile();

    service = module.get(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call log method', async () => {
    await service.log('info', 'Test message', 'TestContext');

    expect(mockLogModel).toHaveBeenCalledWith({
      level: 'info',
      message: 'Test message',
      context: 'TestContext',
      meta: undefined,
    });
  });
});
