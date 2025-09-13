import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateSelectorsDto {
  @IsString()
  @IsNotEmpty()
  imageBase64: string; // Base64 encoded image string
  
  @IsString()
  @IsNotEmpty()
  pageDescription: string; // e.g., "A Facebook group page"
}