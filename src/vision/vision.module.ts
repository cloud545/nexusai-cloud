import { Module } from '@nestjs/common';
import { VisionController } from './vision.controller';
import { VisionService } from './vision.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // <-- 在这里导入 AuthModule
  controllers: [VisionController],
  providers: [VisionService],
})
export class VisionModule {}
