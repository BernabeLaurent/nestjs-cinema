import { Test, TestingModule } from '@nestjs/testing';
import { SessionsCinemasModule } from './sessions-cinemas.module';
import { SessionsCinemasService } from './sessions-cinemas.service';
import { SessionsCinemasController } from './sessions-cinemas.controller';
import { CreateSessionCinemaProvider } from './providers/create-session-cinema.provider';
import { PatchSessionCinemaProvider } from './providers/patch-session-cinema.provider';
import { GetSessionCinemaProvider } from './providers/get-session-cinema.provider';

describe('SessionsCinemasModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SessionsCinemasModule],
    })
      .overrideProvider('SessionCinemaRepository')
      .useValue({})
      .overrideProvider('PriceRepository')
      .useValue({})
      .overrideProvider('MoviesTheatersService')
      .useValue({})
      .overrideProvider('MoviesService')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide SessionsCinemasService', () => {
    const service = module.get(SessionsCinemasService);
    expect(service).toBeDefined();
  });

  it('should provide SessionsCinemasController', () => {
    const controller = module.get<SessionsCinemasController>(
      SessionsCinemasController,
    );
    expect(controller).toBeDefined();
  });

  it('should provide CreateSessionCinemaProvider', () => {
    const provider = module.get<CreateSessionCinemaProvider>(
      CreateSessionCinemaProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide PatchSessionCinemaProvider', () => {
    const provider = module.get<PatchSessionCinemaProvider>(
      PatchSessionCinemaProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide GetSessionCinemaProvider', () => {
    const provider = module.get<GetSessionCinemaProvider>(
      GetSessionCinemaProvider,
    );
    expect(provider).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
