import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface MovieRecommendation {
  title: string;
  year?: string;
  reason: string;
}

export interface MovieRatingAnalysis {
  overallSentiment: 'positive' | 'mixed' | 'negative';
  sentimentScore: number;
  audienceReception: string;
  criticsReception: string;
  keyInsights: string[];
  summary: string;
}

@Injectable()
export class AIRecommendationService {
  private ai;

  constructor(private configService: ConfigService) {
    const gApiKey = this.configService.get<string>('GOOGLE_API_KEY');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const genAI = new GoogleGenerativeAI(gApiKey as string);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.ai = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async getMovieRecommendations(
    movieTitle: string,
    movieYear?: string,
    movieGenre?: string,
    moviePlot?: string,
  ): Promise<MovieRecommendation[]> {
    try {
      const prompt = this.buildPrompt(
        movieTitle,
        movieYear,
        movieGenre,
        moviePlot,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const response = await this.ai.generateContent(prompt);

      // Parse the response
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const content = response.response.text();
      if (content) {
        return this.parseRecommendations(content as string);
      }

      return [];
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }

  private buildPrompt(
    movieTitle: string,
    movieYear?: string,
    movieGenre?: string,
    moviePlot?: string,
  ): string {
    let prompt = `Based on the movie "${movieTitle}"`;

    if (movieYear) {
      prompt += ` (${movieYear})`;
    }

    if (movieGenre) {
      prompt += ` which is a ${movieGenre} movie`;
    }

    if (moviePlot) {
      prompt += ` with the plot: ${moviePlot}`;
    }

    prompt += `\n\nPlease recommend exactly 5 similar movies that fans of this movie would enjoy. For each recommendation, provide:
1. Movie title
2. Year (if known)
3. A brief reason why it's similar (1 sentence)

Format your response as a JSON array with this structure:
[
  {
    "title": "Movie Title",
    "year": "2020",
    "reason": "Brief explanation of similarity"
  }
]

Only return the JSON array, no additional text.`;

    return prompt;
  }

  private parseRecommendations(text: string): MovieRecommendation[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return parsed.slice(0, 5); // Ensure max 5 recommendations
        }
      }

      // Fallback: return empty array if parsing fails
      console.warn('Could not parse AI recommendations response');
      return [];
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return [];
    }
  }

  async analyzeMovieRatings(
    movieTitle: string,
    ratings: Array<{ Source: string; Value: string }>,
    imdbRating: string,
    imdbVotes: string,
    plot?: string,
    genre?: string,
    year?: string,
  ): Promise<MovieRatingAnalysis> {
    try {
      const prompt = this.buildRatingAnalysisPrompt(
        movieTitle,
        ratings,
        imdbRating,
        imdbVotes,
        plot,
        genre,
        year,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const response = await this.ai.generateContent(prompt);

      // Parse the response
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const content = response.response.text();

      if (content) {
        return this.parseRatingAnalysis(content as string);
      }

      return this.getDefaultAnalysis();
    } catch (error) {
      console.error('Error analyzing movie ratings:', error);
      throw error;
    }
  }

  private buildRatingAnalysisPrompt(
    movieTitle: string,
    ratings: Array<{ Source: string; Value: string }>,
    imdbRating: string,
    imdbVotes: string,
    plot?: string,
    genre?: string,
    year?: string,
  ): string {
    let prompt = `Analyze the ratings and reception for the movie "${movieTitle}"`;

    if (year) {
      prompt += ` (${year})`;
    }

    if (genre) {
      prompt += ` - ${genre}`;
    }

    if (plot) {
      prompt += `\n\nPlot: ${plot}`;
    }

    prompt += '\n\nRatings:\n';
    prompt += `- IMDb: ${imdbRating}/10 (${imdbVotes} votes)\n`;

    ratings.forEach((rating) => {
      prompt += `- ${rating.Source}: ${rating.Value}\n`;
    });

    prompt += `\n\nBased on these ratings and the movie information, provide a comprehensive analysis in JSON format:

{
  "overallSentiment": "positive|mixed|negative",
  "sentimentScore": <number 0-100>,
  "audienceReception": "<brief analysis of what audiences think>",
  "criticsReception": "<brief analysis of what critics think>",
  "keyInsights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "summary": "<2-3 sentence overall summary of the movie's reception>"
}

Only return the JSON object, no additional text.`;

    return prompt;
  }

  private parseRatingAnalysis(text: string): MovieRatingAnalysis {
    try {
      // Try to extract JSON from the response
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parsed;
      } catch {
        return this.getDefaultAnalysis();
      }
    } catch (error) {
      console.error('Error parsing rating analysis:', error);
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis(): MovieRatingAnalysis {
    return {
      overallSentiment: 'mixed',
      sentimentScore: 50,
      audienceReception: 'Analysis unavailable',
      criticsReception: 'Analysis unavailable',
      keyInsights: ['Unable to generate insights at this time'],
      summary: 'Rating analysis could not be completed.',
    };
  }
}
