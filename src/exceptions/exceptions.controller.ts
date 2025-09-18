import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CreateExceptionReportDto } from './dto/create-exception-report.dto'; // <-- Corrected DTO path
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard'; // <-- Use the new AdminGuard
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('exceptions')
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  /**
   * Creates a new exception report.
   * This endpoint is for any authenticated agent.
   */
  @Post('report')
  @UseGuards(JwtAuthGuard) // Standard guard for any logged-in user
  createReport(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateExceptionReportDto,
  ) {
    const userId = req.user.id;
    return this.exceptionsService.createReport(userId, dto);
  }

  /**
   * Finds all pending exception reports.
   * This endpoint is for ADMINS ONLY.
   */
  @Get('pending')
  @UseGuards(AdminGuard) // Use the simple and direct AdminGuard
  findAllPendingReports() {
    return this.exceptionsService.findAllPending();
  }

  /**
   * Finds a single exception report by its ID.
   * This endpoint is for ADMINS ONLY.
   */
  @Get(':id') // Corrected route to avoid conflict with 'pending'
  @UseGuards(AdminGuard)
  findOneReport(@Param('id') id: string) {
    return this.exceptionsService.findOne(id);
  }
}