import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Auth0Guard } from './auth0.guard';

@Module({
  imports: [ConfigModule],
  providers: [Auth0Guard],
  exports: [Auth0Guard],
})
export class AuthModule {}
