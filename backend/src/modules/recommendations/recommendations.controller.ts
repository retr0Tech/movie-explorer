import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { Auth0Guard } from '../auth/auth0.guard';

@ApiTags('recommendations')
@ApiBearerAuth('JWT-auth')
@Controller('recommendations')
@UseGuards(Auth0Guard)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @ApiOperation({
    summary: 'Get AI-powered recommendations',
    description:
      'Get movie recommendations based on a specific movie using AI (Hugging Face)',
  })
  @ApiParam({
    name: 'imdbId',
    description: 'IMDB movie ID to base recommendations on',
    example: 'tt0111161',
  })
  @ApiResponse({
    status: 200,
    description: 'Recommendations generated successfully',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({ status: 500, description: 'AI service error' })
  @Get(':imdbId')
  async getRecommendations(@Param('imdbId') imdbId: string) {
    return this.recommendationsService.getRecommendations(imdbId);
  }
}
