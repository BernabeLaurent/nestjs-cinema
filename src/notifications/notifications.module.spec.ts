import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsModule } from './notifications.module';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailProvider } from './providers/email.provider';

describe('NotificationsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [NotificationsModule],
    })
      .overrideProvider('NotificationRepository')
      .useValue({})
      .overrideProvider('UsersService')
      .useValue({})
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide NotificationsService', () => {
    const service = module.get(NotificationsService);
    expect(service).toBeDefined();
  });

  it('should provide NotificationsController', () => {
    const controller = module.get<NotificationsController>(
      NotificationsController,
    );
    expect(controller).toBeDefined();
  });

  it('should provide EmailProvider', () => {
    const provider = module.get(EmailProvider);
    expect(provider).toBeDefined();
  });

  afterEach(async () => {
    await module.close();
  });
});
