import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    return bcrypt.hash(data, salt);
  }

  public async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
