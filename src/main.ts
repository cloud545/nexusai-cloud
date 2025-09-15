import 'tsconfig-paths/register';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // 设置全局路由前缀为 /api
  app.setGlobalPrefix('api');

  // 设置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离非 DTO 定义的属性
      forbidNonWhitelisted: true, // 如果存在非白名单属性，则阻止请求
      transform: true, // 自动转换负载类型（例如 string -> number）
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000', // 假设你的 Next.js 运行在 3000 端口
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(process.env.PORT ?? 3333);
}
void bootstrap();
