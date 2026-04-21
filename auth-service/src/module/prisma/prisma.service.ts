import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionUrl = process.env['DATABASE_URL'] as string;
    // Create the Postgres adapter
    const adapter = new PrismaPg(connectionUrl);

    // Pass the adapter to PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected via PrismaPg adapter');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Prisma disconnected');
  }
}
