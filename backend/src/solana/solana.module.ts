import { Module } from '@nestjs/common';
import { TransactionBuilderService } from './transaction-builder.service';

@Module({
  providers: [TransactionBuilderService],
  exports: [TransactionBuilderService],
})
export class SolanaModule {}
