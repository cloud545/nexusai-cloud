import { Injectable, OnModuleInit } from '@nestjs/common';
//import { PrismaClient } from '../../generated/prisma';
import { PrismaClient } from '@prisma/client'; // <-- 改回这个！


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
