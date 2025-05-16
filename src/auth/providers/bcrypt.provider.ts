import { Injectable, Logger } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  private readonly logger = new Logger(HashingProvider.name, {
    timestamp: true,
  });

  public async hashPassword(data: string | Buffer): Promise<string> {
    this.logger.log(`hashPassword`);
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    this.logger.log(`salt: ${salt}`);
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
