import { Test, TestingModule } from '@nestjs/testing';
import { ImagesModule } from './images.module';
import { ImagesService } from './images.service';

describe('ImagesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ImagesModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ImagesService', () => {
    const service = module.get(ImagesService);
    expect(service).toBeDefined();
  });

  it('should export ImagesService', () => {
    const service = module.get(ImagesService);
    expect(service).toBeInstanceOf(ImagesService);
  });

  afterEach(async () => {
    await module.close();
  });
});
