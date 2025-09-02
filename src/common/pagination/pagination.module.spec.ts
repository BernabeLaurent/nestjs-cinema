import { Test, TestingModule } from '@nestjs/testing';
import { PaginationModule } from './pagination.module';
import { PaginationProvider } from './providers/pagination.provider';

describe('PaginationModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PaginationModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PaginationProvider', () => {
    const provider = module.get(PaginationProvider);
    expect(provider).toBeDefined();
  });

  it('should export PaginationProvider', () => {
    const provider = module.get(PaginationProvider);
    expect(provider).toBeInstanceOf(PaginationProvider);
  });

  afterEach(async () => {
    await module.close();
  });
});
