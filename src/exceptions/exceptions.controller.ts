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
import { CreateExceptionReportDto } from '../vision/dto/create-exception-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('exceptions')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards at the controller level
export class ExceptionsController {
  constructor(private readonly exceptionsService: ExceptionsService) {}

  /**
   * Creates a new exception report.
   * This endpoint is protected and requires a valid JWT.
   * The user ID is automatically extracted from the token.
   * @param req The incoming request object, containing the authenticated user.
   * @param dto The data for the exception report.
   * @returns The newly created exception report object.
   */
  @Post('report')
  createReport(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateExceptionReportDto,
  ) {
    // The userId is extracted from the JWT payload attached by the guard
    const userId = req.user.id; // req.user is populated by JwtStrategy
    return this.exceptionsService.createReport(userId, dto);
  }

  /**
   * Finds all pending exception reports.
   * This endpoint is protected and only accessible by users with the 'ADMIN' role.
   * @returns A list of all pending exception reports.
   */
  @Get('pending')
  @Roles(UserRole.ADMIN)
  findAllPendingReports() {
    return this.exceptionsService.findAllPending();
  }

  /**
   * Finds a single exception report by its ID.
   * This endpoint is protected and only accessible by users with the 'ADMIN' role.
   * @param id The ID of the report to retrieve.
   * @returns The full exception report object, or null if not found.
   */
  @Get('report/:id')
  @Roles(UserRole.ADMIN)
  findOneReport(@Param('id') id: string) {
    return this.exceptionsService.findOne(id);
  }
}
