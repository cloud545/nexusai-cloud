import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 关键！
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 关键！
})
export class PrismaModule {}
