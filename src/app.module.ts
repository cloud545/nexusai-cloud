import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'; // <-- 导入
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger.middleware'; // <-- 导入
import { VisionModule } from './vision/vision.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    VisionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule { // <-- 实现接口
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // <-- 对所有路由应用此中间件
  }
}