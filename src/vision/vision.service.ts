import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerateSelectorsResponseDto } from './dto/generate-selectors-response.dto';

@Injectable()
export class VisionService {
  private readonly logger = new Logger(VisionService.name);
  private cloudClient: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('DASHSCOPE_API_KEY');
    if (apiKey) {
      this.cloudClient = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      });
      this.logger.log(
        'Vision Service Initialized with OpenAI-compatible client.',
      );
    } else {
      this.logger.error(
        'FATAL: DASHSCOPE_API_KEY not found. Vision Service will not work.',
      );
    }
  }

  async generateSelectorsFromHtml(
    htmlContent: string,
    pageDescription: string,
  ): Promise<GenerateSelectorsResponseDto> {
    if (!this.cloudClient) {
      this.logger.error(
        'generateSelectorsFromHtml called but client is not initialized.',
      );
      throw new Error('Vision Service is not initialized. Check API Key.');
    }

    // --- METHOD SCOPE FIX: This call is now valid ---
    const prompt = this.buildHtmlAnalysisPrompt(pageDescription, htmlContent);

    try {
      this.logger.log(
        `Calling qwen-plus for HTML analysis... Prompt length: ${prompt.length}`,
      );

      const response = await this.cloudClient.chat.completions.create(
        {
          model: 'qwen-plus',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          timeout: 60 * 1000,
        },
      );

      this.logger.log('Successfully received response from Qwen API.');

      // --- START OF OBJECT PATH FIX ---
      const textResponse = response.choices[0].message.content;
      // --- END OF OBJECT PATH FIX ---

      if (!textResponse) {
        this.logger.warn('Vision API returned an empty text response.');
        throw new Error('Vision API returned an empty response.');
      }

      this.logger.debug(`Raw AI Response Text: ${textResponse}`);

      const jsonMatch = textResponse.match(/```json([\s\S]*?)```/);

      if (jsonMatch && jsonMatch[1]) {
        try {
          const parsedJson = JSON.parse(
            jsonMatch[1].trim(),
          ) as GenerateSelectorsResponseDto;
          this.logger.log('Successfully parsed JSON from AI response block.');
          return parsedJson;
        } catch (parseError: unknown) {
          this.logger.error(
            'Failed to parse JSON from the AI response block.',
            (parseError as Error).stack,
          );
          this.logger.error(`Content of the block was: ${jsonMatch[1]}`);
          throw new Error('Failed to parse JSON from AI response.');
        }
      }

      this.logger.warn(
        'Vision API response did not contain a valid JSON block.',
      );
      throw new Error('Vision API did not return a valid JSON block.');
    } catch (error: unknown) {
      this.logger.error(
        'A critical error occurred while calling the Qwen API.',
        (error as Error).stack,
      );
      if (error instanceof OpenAI.APIError) {
        this.logger.error(`API Response Status: ${error.status}`);
        this.logger.error(`API Response Data: ${JSON.stringify(error.error)}`);
      }
      throw error;
    }
  }

  // --- START OF MISSING METHOD FIX ---
  // This method is now correctly part of the class.
  private buildHtmlAnalysisPrompt(
    pageDescription: string,
    htmlContent: string,
  ): string {
    return `
      You are an expert Playwright selector generator.
      Analyze this HTML content from a webpage described as "${pageDescription}".
      Your task is to provide robust CSS selectors for the key elements.
      You MUST respond with ONLY a single JSON object in a markdown code block.

      Provide selectors for: "postContainer", "permalink", "authorLink", "likeButton", "commentButton".
      Prioritize selectors using stable attributes like [role], [aria-label], data-attributes, or unique combinations of tags and text.
      Hint: Post containers on this page often have a 'data-testid="post-container"' attribute. Please prioritize using this in your "postContainer" selector.
      **HTML Content Snippet:**
      \`\`\`html
      ${htmlContent.substring(0, 8000)} 
      \`\`\`

      **Example Response:**
      \`\`\`json
      {
        "postContainer": "div[data-pagelet='FeedUnit_{n}']",
        "permalink": "span > a[href*='/permalink/']",
        "authorLink": "h2 > a",
        "likeButton": "div[aria-label='Like']",
        "commentButton": "div[aria-label='Comment']"
      }
      \`\`\`
    `;
  }
  // --- END OF MISSING METHOD FIX ---
}
