import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 600000, // 10 minutes
      max: 100,
      store: 'memory',
    }),
  ],
})
export class AppCacheModule {}
