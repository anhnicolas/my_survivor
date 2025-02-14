import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './src/app/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
})
export class AppModule {}
