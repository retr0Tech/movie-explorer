import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { AuthModule } from '../auth/auth.module';
import { OmdbModule } from '../../infrastructure/omdb/omdb.module';

@Module({
  imports: [AuthModule, OmdbModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
