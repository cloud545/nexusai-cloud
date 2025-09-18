﻿﻿﻿// FILE: nexusai-cloud/apps/api/src/auth/auth.controller.ts

import { Body, Controller, Get, Post, Request, UseGuards, Logger, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from './decorators/public.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // <-- ADD THIS LINE

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController { // Removed duplicate constructor and PrismaService injection
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

  // --- PRECISELY DEPLOY THE GUARD HERE ---
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('agent/tasks/next')
  async getAgentTask(@Request() req: AuthenticatedRequest) {
    console.log('Task request received from user:', req.user.email);
    
    try {
      // Attempt to get a real task from the service.
      const task = await this.authService.getNextAgentTask(req.user.id);
      // If a real task is found, return it immediately.
      return task;
    } catch (error) {
      // If a NotFoundException is thrown (meaning no Persona or Account was found),
      // we catch it and proceed to return the mock data.
      if (error instanceof NotFoundException) {
        Logger.log(
          'No Persona/Account found. Returning mock task data for testing.',
          'AuthController',
        );
        return {
          taskId: 'task-123',
          type: 'BROWSE_GROUP',
          payload: {
            groupName: '上海交友',
          },
          execution_context: {
            adspowerProfileId: 'k1470xgl', // 【关键】确保这个ID是您有效的Adspower Profile ID
            
            // --- 使用清晰的、临时的占位符 ---
            accountId: 'mock_fb_account_id_01',
            personaId: 'mock_persona_id_sales_john'
          }
        };
      }
      // If it's another type of error, re-throw it to be handled by NestJS.
      throw error;
    }
  }
}