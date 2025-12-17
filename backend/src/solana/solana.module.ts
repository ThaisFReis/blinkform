import { Module } from '@nestjs/common';
import { TransactionBuilderService } from './transaction-builder.service';
import { MetaplexService } from './metaplex.service';
import { KeypairService } from './keypair.service';

@Module({
  providers: [TransactionBuilderService, MetaplexService, KeypairService],
  exports: [TransactionBuilderService, MetaplexService, KeypairService],
})
export class SolanaModule {}
