import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { AuthModule } from '../auth/auth.module';
import { OmdbModule } from '../../infrastructure/omdb/omdb.module';
import { AIModule } from '../../infrastructure/ai/ai.module';

@Module({
  imports: [AuthModule, OmdbModule, AIModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
