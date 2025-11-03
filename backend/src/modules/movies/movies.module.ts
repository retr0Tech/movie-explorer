import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Favorite } from './entities/favorite.orm-entity';
import { AuthModule } from '../auth/auth.module';
import { OmdbModule } from '../../infrastructure/omdb/omdb.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), AuthModule, OmdbModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
