import { Test, TestingModule } from '@nestjs/testing';
import { SessionsCinemasService } from './sessions-cinemas.service';

describe('SessionsCinemasService', () => {
  let service: SessionsCinemasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsCinemasService],
    }).compile();

    service = module.get<SessionsCinemasService>(SessionsCinemasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
