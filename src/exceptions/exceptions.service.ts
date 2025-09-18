import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExceptionReportDto } from './dto/create-exception-report.dto';
import { ReportStatus } from '@prisma/client';


@Injectable()
export class ExceptionsService {
  private readonly logger = new Logger(ExceptionsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: string, dto: CreateExceptionReportDto) {
    this.logger.log(`Attempting to create report for user ID: ${userId}`);
    this.logger.debug(`Data to be written: ${JSON.stringify(dto, null, 2)}`);
    const newReport = await this.prisma.exceptionReport.create({
      data: {
        ownerId: userId,
        ...dto,
      },
    });
    return newReport;
  }

  async findAllPending() {
    this.logger.log('Attempting to fetch all PENDING exception reports...');
    try {
      const reports = await this.prisma.exceptionReport.findMany({
        where: { status: 'PENDING' },
        orderBy: { timestamp: 'desc' },
      });
      this.logger.log(`Found ${reports.length} pending reports.`);
      return reports;
    } catch (error) {
      this.logger.error('Failed to fetch pending reports from database.', error.stack);
      throw error; // Re-throw the error to be caught by NestJS's exception handler
    }
  }

  async findOne(id: string) {
    return this.prisma.exceptionReport.findUnique({
      where: {
        id,
      },
    });
  }
}
