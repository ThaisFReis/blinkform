import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ActionsModule } from './actions/actions.module';
import { FormsController } from './forms/forms.controller';
import { FormsService } from './forms/forms.service';
import { SchemaParserService } from './schema-parser/schema-parser.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    RedisModule,
    ActionsModule,
  ],
  controllers: [AppController, FormsController],
  providers: [AppService, FormsService, SchemaParserService],
})
export class AppModule {}
