import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('email', () => {
  return {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    fromName: process.env.EMAIL_FROM_NAME,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
  };
});
