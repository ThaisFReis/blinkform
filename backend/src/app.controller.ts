import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    const dbHealthy = await this.prisma.isHealthy();

    return {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: dbHealthy ? 'healthy' : 'unhealthy',
      },
    };
  }

  @Get('health/db')
  async databaseHealth() {
    try {
      const result = await this.prisma.$queryRaw<Array<{
        version: string;
        database: string;
        user: string;
        server_ip: string;
        server_port: number;
      }>>`SELECT
        version() as version,
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port`;

      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        database: result[0],
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'N/A',
      };
    }
  }
}
