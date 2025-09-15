import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateSelectorsDto {
  @IsString()
  @IsNotEmpty()
  htmlContent: string; // Ensure this is the expected property

  @IsString()
  @IsNotEmpty()
  pageDescription: string;
}
