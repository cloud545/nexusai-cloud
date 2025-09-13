import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class VisionService {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKeyFromEnv = this.configService.get<string>('DASHSCOPE_API_KEY');
    if (!apiKeyFromEnv) {
      throw new Error('DASHSCOPE_API_KEY is not configured in .env file.');
    }
    
    this.client = new OpenAI({
      apiKey: apiKeyFromEnv,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
  }

  async generateSelectorsFromImage(imageBase64: string, pageDescription: string): Promise<any> {
    const prompt = this.buildVisionPrompt(pageDescription);

    try {
      console.log('[VisionService] Calling qwen-vl-plus API via OpenAI compatible endpoint...');
      
      const response = await this.client.chat.completions.create({
        model: 'qwen-vl-plus',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${imageBase64}`,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });

      const textResponse = response.choices[0].message.content;
      const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
      
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      throw new Error(`Vision API did not return a valid JSON block. Response: ${textResponse}`);

    } catch (error) {
      console.error('Failed to call Vision API:', error);
      // 抛出更具体的 NestJS 异常，或者直接重新抛出原始错误
      throw new Error(`Failed to process image with Vision API: ${error.message}`);
    }
  }

  // --- START OF RETURN STATEMENT FIX ---
  private buildVisionPrompt(pageDescription: string): string {
    return `
      You are an expert Playwright selector generator.
      Analyze this screenshot of a webpage described as "${pageDescription}".
      Your task is to provide robust CSS selectors for the key elements.
      You MUST respond with ONLY a single JSON object in a markdown code block.

      Provide selectors for the following keys:
      1. "postContainer": The main wrapper for a single post.
      2. "permalink": The link to the post's unique page, usually on a timestamp.
      3. "authorLink": The link to the post author's profile.
      4. "likeButton": The button to like the post.
      5. "commentButton": The button to open the comment section.
      
      Prioritize selectors using stable attributes like [role], [aria-label], or data attributes over fragile CSS classes.

      Example Response:
      \`\`\`json
      {
        "postContainer": "div[role='article']",
        "permalink": "a[href*='/permalink/']",
        "authorLink": "div[role='heading'] a",
        "likeButton": "div[aria-label='Like']",
        "commentButton": "div[aria-label='Comment']"
      }
      \`\`\`
    `; 
  }
  // --- END OF RETURN STATEMENT FIX ---
}