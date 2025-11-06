import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { AuthModule } from '../auth/auth.module';
import { OmdbModule } from '../../infrastructure/omdb/omdb.module';
import { AIModule } from '../../infrastructure/ai/ai.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [AuthModule, OmdbModule, AIModule, FavoritesModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
