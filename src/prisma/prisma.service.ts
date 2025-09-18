import { Injectable, OnModuleInit, Logger, InternalServerErrorException } from '@nestjs/common';
//import { PrismaClient } from '../../generated/prisma';
import { PrismaClient } from '@prisma/client'; // <-- 改回这个！


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.logger.log('PrismaService initialized. Attempting to connect to the database...');
    try {
      await this.$connect();
      this.logger.log('Database connection established successfully.');
    } catch (error) {
      this.logger.error('FATAL: Failed to connect to the database.', error.stack);
      // Throw a NestJS-specific exception to halt the bootstrap process gracefully
      // and provide a clear error message in the console.
      throw new InternalServerErrorException('Could not connect to the database. Please check your DATABASE_URL and ensure the database server is running.');
    }
  }
}
