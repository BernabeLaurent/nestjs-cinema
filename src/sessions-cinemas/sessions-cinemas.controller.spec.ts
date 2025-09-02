import { Test, TestingModule } from '@nestjs/testing';
import { SessionsCinemasController } from './sessions-cinemas.controller';

describe('SessionsCinemasController', () => {
  let controller: SessionsCinemasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsCinemasController],
    }).compile();

    controller = module.get(SessionsCinemasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
