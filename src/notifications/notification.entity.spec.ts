import { Notification } from './notification.entity';
import { User } from '../users/user.entity';

describe('Notification Entity', () => {
  let notification: Notification;

  beforeEach(() => {
    notification = new Notification();
  });

  it('should be defined', () => {
    expect(notification).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(notification).toHaveProperty('id');
    expect(notification).toHaveProperty('userId');
    expect(notification).toHaveProperty('user');
    expect(notification).toHaveProperty('createDate');
    expect(notification).toHaveProperty('updateDate');
    expect(notification).toHaveProperty('deleteDate');
  });

  it('should set userId correctly', () => {
    const userId = 42;
    notification.userId = userId;
    expect(notification.userId).toBe(userId);
  });

  it('should set user relationship correctly', () => {
    const user = new User();
    user.id = 1;
    notification.user = user;
    expect(notification.user).toBe(user);
    expect(notification.user.id).toBe(1);
  });

  it('should set dates correctly', () => {
    const now = new Date();
    notification.createDate = now;
    notification.updateDate = now;
    expect(notification.createDate).toBe(now);
    expect(notification.updateDate).toBe(now);
  });
});
