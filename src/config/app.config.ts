import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION || '1.0',
  nestjsPort: process.env.NESTJS_PORT
    ? parseInt(process.env.NESTJS_PORT)
    : 3000,
  apiUrl:
    process.env.API_URL ||
    `http://localhost:${process.env.NESTJS_PORT ? parseInt(process.env.NESTJS_PORT) : 3000}`,
}));
