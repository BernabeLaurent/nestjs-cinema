import { RoleUser } from './roles-users.enum';

describe('RoleUser Enum', () => {
  it('should be defined', () => {
    expect(RoleUser).toBeDefined();
  });

  it('should have correct values', () => {
    expect(RoleUser.CUSTOMER).toBe('CUSTOMER');
    expect(RoleUser.ADMIN).toBe('ADMIN');
    expect(RoleUser.WORKER).toBe('WORKER');
  });

  it('should contain all expected roles', () => {
    const expectedRoles = ['CUSTOMER', 'ADMIN', 'WORKER'];
    const enumValues = Object.values(RoleUser);

    expect(enumValues).toEqual(expectedRoles);
    expect(enumValues).toHaveLength(3);
  });

  it('should have correct keys', () => {
    const expectedKeys = ['CUSTOMER', 'ADMIN', 'WORKER'];
    const enumKeys = Object.keys(RoleUser);

    expect(enumKeys).toEqual(expectedKeys);
    expect(enumKeys).toHaveLength(3);
  });
});
