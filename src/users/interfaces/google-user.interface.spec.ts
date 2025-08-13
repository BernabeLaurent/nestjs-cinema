import { GoogleUser } from './google-user.interface';

describe('GoogleUser Interface', () => {
  let googleUser: GoogleUser;

  beforeEach(() => {
    googleUser = {
      email: 'test@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      googleId: '123456789',
    };
  });

  it('should be defined', () => {
    expect(googleUser).toBeDefined();
  });

  it('should have correct properties', () => {
    expect(googleUser).toHaveProperty('email');
    expect(googleUser).toHaveProperty('firstName');
    expect(googleUser).toHaveProperty('lastName');
    expect(googleUser).toHaveProperty('googleId');
  });

  it('should accept valid email', () => {
    expect(googleUser.email).toBe('test@gmail.com');
  });

  it('should accept valid firstName', () => {
    expect(googleUser.firstName).toBe('John');
  });

  it('should accept valid lastName', () => {
    expect(googleUser.lastName).toBe('Doe');
  });

  it('should accept valid googleId', () => {
    expect(googleUser.googleId).toBe('123456789');
  });

  it('should create valid GoogleUser object', () => {
    const newGoogleUser: GoogleUser = {
      email: 'jane@gmail.com',
      firstName: 'Jane',
      lastName: 'Smith',
      googleId: '987654321',
    };

    expect(newGoogleUser.email).toBe('jane@gmail.com');
    expect(newGoogleUser.firstName).toBe('Jane');
    expect(newGoogleUser.lastName).toBe('Smith');
    expect(newGoogleUser.googleId).toBe('987654321');
  });
});
