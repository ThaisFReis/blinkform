import { Injectable, Logger } from '@nestjs/common';
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  TransactionInstruction,
  Transaction,
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
      this.logger.log(`Creating memo transaction for account: ${account}`);
      this.logger.log(`Memo: ${memo}`);
      const memoSize = Buffer.from(memo, 'utf-8').length;
      this.logger.log(`Memo size: ${memoSize} bytes`);

      // Check memo size limit (SPL Memo allows up to 566 bytes)
      const MAX_MEMO_SIZE = 566;
      let finalMemo = memo;
      if (memoSize > MAX_MEMO_SIZE) {
        this.logger.warn(`Memo size ${memoSize} exceeds limit ${MAX_MEMO_SIZE}, truncating`);
        finalMemo = memo.substring(0, MAX_MEMO_SIZE - 3) + '...';
        this.logger.log(`Truncated memo: ${finalMemo}`);
      }

      // Parse user's public key
      const userPublicKey = new PublicKey(account);

      // Get latest blockhash
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

      // Create memo instruction using SPL Memo program
      // Program ID: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr
      // Include signer in keys array for proper simulation
      const memoInstruction = new TransactionInstruction({
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        keys: [
          {
            pubkey: userPublicKey,
            isSigner: true,
            isWritable: false,
          },
        ],
        data: Buffer.from(finalMemo, 'utf-8'),
      });

      // Build legacy transaction (more compatible with wallets)
      const transaction = new Transaction({
        feePayer: userPublicKey,
        recentBlockhash: blockhash,
      }).add(memoInstruction);

      // Serialize transaction to base64
      const serializedTransaction = Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');

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
