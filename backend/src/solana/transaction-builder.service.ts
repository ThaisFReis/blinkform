import { Injectable, Logger } from '@nestjs/common';
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  TransactionInstruction,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

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
   * Creates a SOL transfer transaction
   */
  async createSystemTransferTransaction(
    fromAccount: string,
    toAccount: string,
    amount: number
  ): Promise<string> {
    try {
      this.logger.log(`Creating SOL transfer transaction: ${amount} SOL from ${fromAccount} to ${toAccount}`);

      const fromPublicKey = new PublicKey(fromAccount);
      const toPublicKey = new PublicKey(toAccount);

      // Convert SOL to lamports
      const lamports = amount * LAMPORTS_PER_SOL;

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();

      // Create transfer instruction
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports,
      });

      // Build transaction
      const transaction = new Transaction({
        feePayer: fromPublicKey,
        recentBlockhash: blockhash,
      }).add(transferInstruction);

      // Serialize transaction
      const serializedTransaction = Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');

      this.logger.log(`SOL transfer transaction created successfully`);

      return serializedTransaction;
    } catch (error) {
      this.logger.error('Failed to create SOL transfer transaction:', error);
      throw new Error(`Failed to create SOL transfer: ${error.message}`);
    }
  }

  /**
   * Creates a SPL token transfer transaction
   */
  async createSplTransferTransaction(
    fromAccount: string,
    toAccount: string,
    mintAddress: string,
    amount: number,
    decimals: number = 9
  ): Promise<string> {
    try {
      this.logger.log(`Creating SPL token transfer: ${amount} tokens from ${fromAccount} to ${toAccount}`);
      this.logger.log(`Mint: ${mintAddress}, Decimals: ${decimals}`);

      const fromPublicKey = new PublicKey(fromAccount);
      const toPublicKey = new PublicKey(toAccount);
      const mintPublicKey = new PublicKey(mintAddress);

      // Validate mint address
      const mintInfo = await this.connection.getAccountInfo(mintPublicKey);
      if (!mintInfo) {
        throw new Error(`Invalid mint address: ${mintAddress}`);
      }
      this.logger.log('Mint address is valid');

      // Get associated token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, fromPublicKey);
      const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

      this.logger.log(`From token account: ${fromTokenAccount.toBase58()}`);
      this.logger.log(`To token account: ${toTokenAccount.toBase58()}`);

      // Check if sender's token account exists and has balance
      const fromTokenAccountInfo = await this.connection.getAccountInfo(fromTokenAccount);
      if (!fromTokenAccountInfo) {
        throw new Error(`Sender does not have token account for mint ${mintAddress}`);
      }
      this.logger.log('Sender token account exists');

      // Check token balance (optional - just for logging)
      try {
        const tokenBalance = await this.connection.getTokenAccountBalance(fromTokenAccount);
        this.logger.log(`Sender token balance: ${tokenBalance.value.uiAmount} tokens`);
      } catch (balanceError) {
        this.logger.warn('Could not get token balance:', balanceError.message);
      }

      // Check if recipient's associated token account exists
      const toTokenAccountInfo = await this.connection.getAccountInfo(toTokenAccount);
      this.logger.log(`Recipient token account exists: ${!!toTokenAccountInfo}`);

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: fromPublicKey,
        recentBlockhash: blockhash,
      });

      // If recipient's token account doesn't exist, create it
      if (!toTokenAccountInfo) {
        this.logger.log('Creating associated token account for recipient');
        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          fromPublicKey, // payer
          toTokenAccount, // associated token account
          toPublicKey, // owner
          mintPublicKey, // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction.add(createAtaInstruction);
      }

      // Convert amount to smallest unit
      const transferAmount = Math.floor(amount * Math.pow(10, decimals));
      this.logger.log(`Transfer amount (smallest unit): ${transferAmount}`);

      if (transferAmount <= 0) {
        throw new Error(`Transfer amount too small: ${amount} with ${decimals} decimals results in ${transferAmount} smallest units`);
      }

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromPublicKey,
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      );

      transaction.add(transferInstruction);

      // Serialize transaction
      const serializedTransaction = Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');

      this.logger.log(`SPL token transfer transaction created successfully`);

      return serializedTransaction;
    } catch (error) {
      this.logger.error('Failed to create SPL token transfer transaction:', error);
      throw new Error(`Failed to create SPL transfer: ${error.message}`);
    }
  }

  /**
   * Creates a transaction based on type and parameters
   */
  async createTransaction(
    transactionType: string,
    account: string,
    parameters: any
  ): Promise<string> {
    switch (transactionType) {
      case 'SYSTEM_TRANSFER':
        return this.createSystemTransferTransaction(
          account,
          parameters.recipientAddress,
          parameters.amount
        );

      case 'SPL_TRANSFER':
        return this.createSplTransferTransaction(
          account,
          parameters.recipientAddress,
          parameters.mintAddress,
          parameters.amount,
          parameters.decimals || 9
        );

      case 'SPL_MINT':
        // For now, fall back to memo - minting requires more complex setup
        this.logger.warn('SPL_MINT not implemented yet, using memo fallback');
        return this.createMemoTransaction(account, `Mint request: ${JSON.stringify(parameters)}`);

      case 'CUSTOM_CALL':
        // For now, fall back to memo - custom calls require program-specific logic
        this.logger.warn('CUSTOM_CALL not implemented yet, using memo fallback');
        return this.createMemoTransaction(account, `Custom call request: ${JSON.stringify(parameters)}`);

      default:
        this.logger.warn(`Unknown transaction type: ${transactionType}, using memo fallback`);
        return this.createMemoTransaction(account, `Unknown transaction: ${transactionType} - ${JSON.stringify(parameters)}`);
    }
  }

  /**
   * Get connection instance for testing or advanced usage
   */
  getConnection(): Connection {
    return this.connection;
  }
}
