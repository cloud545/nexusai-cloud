// 1. 从'@nestjs/common'的导入中，移除 UsePipes
import { Body, Controller, Post, Get, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
// 2. 移除应用在整个控制器上的 @UsePipes 装饰器
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  // 3. 将 ValidationPipe 精准地应用在 Body 上
  register(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  // 4. 将 ValidationPipe 精准地应用在 Body 上
  login(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  // 这个方法现在是“干净”的，不受任何不相关的Pipe影响
  @Get('agent/tasks/next')
  getAgentTask(@Request() req) {
    console.log('Task request received from user:', req.user.email);
    return {
      taskId: 'task-123',
      type: 'BROWSE_GROUP',
      payload: {
        groupName: '上海健身爱好者',
      },
    };
  }
}