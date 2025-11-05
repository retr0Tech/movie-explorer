import { Injectable } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';

export interface MovieRecommendation {
  title: string;
  year?: string;
  reason: string;
}

@Injectable()
export class AIRecommendationService {
  private hf: HfInference;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('HF_API_KEY');
    if (!apiKey) {
      console.warn(
        'HF_API_KEY not configured. AI recommendations will not work.',
      );
    }
    this.hf = new HfInference(apiKey || 'placeholder');
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

      const response = await this.hf.chatCompletion({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      // Parse the response
      const content = response.choices[0]?.message?.content;
      if (content) {
        return this.parseRecommendations(content);
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
}
