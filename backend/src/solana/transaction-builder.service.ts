import { Injectable, Logger } from '@nestjs/common';
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
} from '@solana/web3.js';

@Injectable()
export class TransactionBuilderService {
  private readonly logger = new Logger(TransactionBuilderService.name);
  private connection: Connection;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.logger.log(`Connected to Solana: ${rpcUrl}`);
  }

  /**
   * Creates a SPL Memo transaction with form data
   *
   * @param account - User's wallet address (base58 encoded public key)
   * @param memo - Memo data to include in transaction
   * @returns Base64-encoded serialized transaction
   */
  async createMemoTransaction(
    account: string,
    memo: string
  ): Promise<string> {
    try {
      this.logger.debug(`Creating memo transaction for account: ${account}`);
      this.logger.debug(`Memo: ${memo}`);

      // Parse user's public key
      const userPublicKey = new PublicKey(account);

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

      // Create memo instruction using SPL Memo program
      // Program ID: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr
      const memoInstruction = {
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        keys: [],
        data: Buffer.from(memo, 'utf-8'),
      };

      // Add compute budget to optimize transaction
      const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000,
      });

      // Build transaction message
      const messageV0 = new TransactionMessage({
        payerKey: userPublicKey,
        recentBlockhash: blockhash,
        instructions: [computeUnitLimitIx, memoInstruction],
      }).compileToV0Message();

      // Create versioned transaction
      const transaction = new VersionedTransaction(messageV0);

      // Serialize transaction to base64
      const serializedTransaction = Buffer.from(transaction.serialize()).toString('base64');

      this.logger.debug(`Transaction created successfully. Blockhash: ${blockhash}`);

      return serializedTransaction;
    } catch (error) {
      this.logger.error('Failed to create memo transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  /**
   * Get connection instance for testing or advanced usage
   */
  getConnection(): Connection {
    return this.connection;
  }
}
