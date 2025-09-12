﻿import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('agent/tasks/next')
  getAgentTask(@Request() req) {
    console.log('Task request received from user:', req.user.email);
    return {
      taskId: 'task-123',
      type: 'BROWSE_GROUP',
      payload: {
        groupName: '上海交友',
      },
    };
  }
}