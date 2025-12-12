import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 seconds
  private readonly CONNECTION_TIMEOUT = 15000; // 15 seconds

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
      errorFormat: 'pretty',
    });

    // Log database queries in development
    if (process.env.NODE_ENV !== 'production') {
      this.$on('query' as never, (e: any) => {
        this.logger.debug(`Query: ${e.query} - Duration: ${e.duration}ms`);
      });
    }

    // Log all errors
    this.$on('error' as never, (e: any) => {
      this.logger.error(`Prisma Error: ${e.message}`);
    });
  }

  async onModuleInit() {
    this.logger.log('Initializing Prisma connection...');

    // Log connection info (without password)
    const dbUrl = process.env.DATABASE_URL || '';
    const sanitizedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
    this.logger.log(`Connecting to: ${sanitizedUrl}`);

    await this.connectWithRetry();
  }

  private async connectWithRetry(attempt: number = 1): Promise<void> {
    try {
      this.logger.log(`Connection attempt ${attempt}/${this.MAX_RETRIES}...`);

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Connection timeout after ${this.CONNECTION_TIMEOUT}ms`)),
          this.CONNECTION_TIMEOUT
        )
      );

      // Race between connection and timeout
      await Promise.race([
        this.$connect(),
        timeoutPromise
      ]);

      this.logger.log('✅ Successfully connected to database');

      // Test the connection with a simple query
      await this.$queryRaw`SELECT 1 as connected`;
      this.logger.log('✅ Database query test passed');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = (error as any)?.code || 'N/A';

      this.logger.error(`❌ Database connection failed (Attempt ${attempt}/${this.MAX_RETRIES})`);
      this.logger.error(`Error message: ${errorMessage}`);
      this.logger.error(`Error code: ${errorCode}`);

      // Provide specific guidance based on error code
      this.logErrorGuidance(errorCode, errorMessage);

      if (attempt < this.MAX_RETRIES) {
        this.logger.warn(`Retrying in ${this.RETRY_DELAY}ms...`);
        await this.delay(this.RETRY_DELAY);
        return this.connectWithRetry(attempt + 1);
      } else {
        this.logger.error('❌ Max retries reached. Database connection failed.');
        this.logger.error('Please check:');
        this.logger.error('1. DATABASE_URL environment variable is set correctly');
        this.logger.error('2. Supabase database is running and accessible');
        this.logger.error('3. Connection string includes sslmode=require');
        this.logger.error('4. Password is correct and properly URL-encoded');
        this.logger.error('5. Network/firewall allows connection to Supabase');

        // In serverless environments, we might want to throw
        // In development, we might want to continue with degraded service
        if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
          throw new Error(`Failed to connect to database after ${this.MAX_RETRIES} attempts: ${errorMessage}`);
        } else {
          this.logger.warn('⚠️  Continuing without database connection (development mode)');
        }
      }
    }
  }

  private logErrorGuidance(errorCode: string, errorMessage: string): void {
    if (errorCode === 'P1001') {
      this.logger.error('🔍 P1001 Error - Cannot reach database server');
      this.logger.error('Common causes:');
      this.logger.error('  - Missing sslmode=require parameter');
      this.logger.error('  - Incorrect host/port');
      this.logger.error('  - Firewall blocking connection');
      this.logger.error('  - Database server is down');
    } else if (errorCode === 'P1002') {
      this.logger.error('🔍 P1002 Error - Connection timeout');
      this.logger.error('  - Network latency too high');
      this.logger.error('  - Add connect_timeout parameter');
    } else if (errorMessage.includes('password authentication failed')) {
      this.logger.error('🔍 Authentication Error');
      this.logger.error('  - Check password is correct');
      this.logger.error('  - Ensure special characters are URL-encoded');
      this.logger.error('  - Verify username is correct');
    } else if (errorMessage.includes('SSL')) {
      this.logger.error('🔍 SSL Error');
      this.logger.error('  - Add sslmode=require to connection string');
      this.logger.error('  - Supabase requires SSL connections');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return false;
    }
  }
}