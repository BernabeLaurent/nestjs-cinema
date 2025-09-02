import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserProvider } from './providers/create-user.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';

describe('UsersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider('UserRepository')
      .useValue({})
      .overrideProvider('AuthService')
      .useValue({})
      .overrideProvider('BookingsService')
      .useValue({})
      .overrideProvider('NotificationsService')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide UsersService', () => {
    const service = module.get(UsersService);
    expect(service).toBeDefined();
  });

  it('should provide UsersController', () => {
    const controller = module.get(UsersController);
    expect(controller).toBeDefined();
  });

  it('should provide CreateUserProvider', () => {
    const provider = module.get(CreateUserProvider);
    expect(provider).toBeDefined();
  });

  it('should provide UpdateUserProvider', () => {
    const provider = module.get(UpdateUserProvider);
    expect(provider).toBeDefined();
  });

  it('should provide FindOneUserByEmailProvider', () => {
    const provider = module.get<FindOneUserByEmailProvider>(
      FindOneUserByEmailProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide FindOneByGoogleIdProvider', () => {
    const provider = module.get<FindOneByGoogleIdProvider>(
      FindOneByGoogleIdProvider,
    );
    expect(provider).toBeDefined();
  });

  it('should provide CreateGoogleUserProvider', () => {
    const provider = module.get<CreateGoogleUserProvider>(
      CreateGoogleUserProvider,
    );
    expect(provider).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
