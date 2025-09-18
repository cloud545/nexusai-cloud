import { Controller, Post, Body } from '@nestjs/common';
import { VisionService } from './vision.service';
import { GenerateSelectorsDto } from './dto/generate-selectors.dto';
import { GenerateSelectorsResponseDto } from './dto/generate-selectors-response.dto';
import { /*...,*/ UseGuards } from '@nestjs/common'; // <-- ADD UseGuards here
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // <-- ADD THIS LINE

@Controller('vision')
@UseGuards(JwtAuthGuard)
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Post('generate-selectors')
  async generateSelectors(
    @Body() generateSelectorsDto: GenerateSelectorsDto,
  ): Promise<GenerateSelectorsResponseDto> {
    // Ensure we are calling the correct service method with the correct properties
    return this.visionService.generateSelectorsFromHtml(
      generateSelectorsDto.htmlContent,
      generateSelectorsDto.pageDescription,
    );
  }
}
