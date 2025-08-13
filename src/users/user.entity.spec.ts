import { User } from './user.entity';
import { RoleUser } from './enums/roles-users.enum';
import { RegionsIso } from '../common/enums/regions-iso.enum';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('googleId');
    expect(user).toHaveProperty('hasDisability');
    expect(user).toHaveProperty('roleUser');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('zipCode');
    expect(user).toHaveProperty('codeCountry');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('createDate');
    expect(user).toHaveProperty('updateDate');
    expect(user).toHaveProperty('deleteDate');
    expect(user).toHaveProperty('notifications');
    expect(user).toHaveProperty('reviews');
    expect(user).toHaveProperty('bookings');
  });

  it('should set firstName correctly', () => {
    const firstName = 'John';
    user.firstName = firstName;
    expect(user.firstName).toBe(firstName);
  });

  it('should set lastName correctly', () => {
    const lastName = 'Doe';
    user.lastName = lastName;
    expect(user.lastName).toBe(lastName);
  });

  it('should set email correctly', () => {
    const email = 'john.doe@example.com';
    user.email = email;
    expect(user.email).toBe(email);
  });

  it('should set googleId correctly', () => {
    const googleId = '123456789';
    user.googleId = googleId;
    expect(user.googleId).toBe(googleId);
  });

  it('should set hasDisability correctly', () => {
    user.hasDisability = true;
    expect(user.hasDisability).toBe(true);
  });

  it('should set roleUser correctly', () => {
    user.roleUser = RoleUser.ADMIN;
    expect(user.roleUser).toBe(RoleUser.ADMIN);
  });

  it('should set address correctly', () => {
    const address = '123 Main St';
    user.address = address;
    expect(user.address).toBe(address);
  });

  it('should set city correctly', () => {
    const city = 'Paris';
    user.city = city;
    expect(user.city).toBe(city);
  });

  it('should set zipCode correctly', () => {
    const zipCode = 75001;
    user.zipCode = zipCode;
    expect(user.zipCode).toBe(zipCode);
  });

  it('should set codeCountry correctly', () => {
    user.codeCountry = RegionsIso.FRANCE;
    expect(user.codeCountry).toBe(RegionsIso.FRANCE);
  });

  it('should set phoneNumber correctly', () => {
    const phoneNumber = '0123456789';
    user.phoneNumber = phoneNumber;
    expect(user.phoneNumber).toBe(phoneNumber);
  });

  it('should set password correctly', () => {
    const password = 'password123';
    user.password = password;
    expect(user.password).toBe(password);
  });

  it('should set dates correctly', () => {
    const now = new Date();
    user.createDate = now;
    user.updateDate = now;
    expect(user.createDate).toBe(now);
    expect(user.updateDate).toBe(now);
  });
});
