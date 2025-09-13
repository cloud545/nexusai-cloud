import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenerateSelectorsDto } from './dto/generate-selectors.dto'; 
import { VisionService } from './vision.service';

@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('generate-selectors')
  generateSelectors(@Body() dto: GenerateSelectorsDto) {
    // 建议将整个 DTO 传递给服务层，这样更简洁且易于维护
    // 如果服务层需要修改以接受 DTO，这也是一个好的实践
    return this.visionService.generateSelectorsFromImage(dto.imageBase64, dto.pageDescription);
  }
}
