import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExceptionReportDto } from '../vision/dto/create-exception-report.dto';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ExceptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: string, dto: CreateExceptionReportDto) {
    const newReport = await this.prisma.exceptionReport.create({
      data: {
        ownerId: userId,
        ...dto,
      },
    });
    return newReport;
  }

  async findAllPending() {
    return this.prisma.exceptionReport.findMany({
      where: {
        status: ReportStatus.PENDING,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.exceptionReport.findUnique({
      where: {
        id,
      },
    });
  }
}
