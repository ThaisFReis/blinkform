import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SchemaParserModule } from '../schema-parser/schema-parser.module';
import { SolanaModule } from '../solana/solana.module';

@Module({
  imports: [PrismaModule, RedisModule, SchemaParserModule, SolanaModule],
  controllers: [ActionsController],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}