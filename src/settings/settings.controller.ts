// FILE: nexusai-cloud/apps/api/src/settings/settings.controller.ts

import { Controller, Get, Body, Patch, Request } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto';
import { /*...,*/ UseGuards } from '@nestjs/common'; // <-- ADD UseGuards here
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // <-- ADD THIS LINE

// Assuming you have a standard way to get the authenticated user from the request
interface AuthenticatedRequest extends Request {
    user: { id: string };
}

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('ai')
  getAiSettings(@Request() req: AuthenticatedRequest) {
    return this.settingsService.getAiSettings(req.user.id);
  }

  @Patch('ai')
  updateAiSettings(
    @Request() req: AuthenticatedRequest,
    @Body() updateAiSettingsDto: UpdateAiSettingsDto,
  ) {
    return this.settingsService.updateAiSettings(req.user.id, updateAiSettingsDto);
  }
}