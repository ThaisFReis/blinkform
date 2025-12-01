import { Module } from '@nestjs/common';
import { SchemaParserService } from './schema-parser.service';

@Module({
  providers: [SchemaParserService],
  exports: [SchemaParserService],
})
export class SchemaParserModule {}