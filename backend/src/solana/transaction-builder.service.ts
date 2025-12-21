import { Injectable, Logger, Inject } from '@nestjs/common';
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
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { MetaplexService, CreateTokenParams } from './metaplex.service';
import { validateSolanaAddress, isPlaceholder } from '../utils/solana-validation.utils';

@Injectable()
export class TransactionBuilderService {
  private readonly logger = new Logger(TransactionBuilderService.name);
  private connection: Connection;

  constructor(
    @Inject(MetaplexService) private metaplexService: MetaplexService,
  ) {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.logger.log(`Connected to Solana: ${rpcUrl}`);
  }

  /**
   * Validates a Solana address format with strict base58 checking
   */
  private validateSolanaAddressStrict(address: string): { valid: boolean; error?: string } {
    return validateSolanaAddress(address);
  }

  /**
   * Validates amount with decimals
   */
  private validateAmount(amount: number, decimals: number = 9): boolean {
    if (amount <= 0 || !isFinite(amount)) return false;

    const smallestUnit = amount * Math.pow(10, decimals);
    const maxAmount = Math.pow(2, 64) - 1; // u64 max

    return smallestUnit > 0 && smallestUnit <= maxAmount && Number.isInteger(smallestUnit);
  }

  /**
   * Validates token decimals
   */
  private validateDecimals(decimals: number): boolean {
    return Number.isInteger(decimals) && decimals >= 0 && decimals <= 9;
  }

  /**
   * Validates URI format (basic check)
   */
  private validateUri(uri: string): boolean {
    try {
      new URL(uri);
      return uri.startsWith('http://') || uri.startsWith('https://');
    } catch {
      return false;
    }
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

      // Validate fromAccount before creating PublicKey
      const fromValidation = this.validateSolanaAddressStrict(fromAccount);
      if (!fromValidation.valid) {
        throw new Error(`Invalid sender address (fromAccount): ${fromValidation.error}`);
      }

      // Validate toAccount
      const toValidation = this.validateSolanaAddressStrict(toAccount);
      if (!toValidation.valid) {
        throw new Error(`Invalid recipient address (toAccount): ${toValidation.error}`);
      }

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
   * Creates a SPL token mint transaction
   */
  async createSplMintTransaction(
    mintAuthorityAccount: string,
    mintAddress: string,
    recipientAddress: string,
    amount: number,
    decimals: number = 9
  ): Promise<string> {
    try {
      this.logger.log(`Creating SPL token mint: ${amount} tokens to ${recipientAddress}`);
      this.logger.log(`Mint: ${mintAddress}, Authority: ${mintAuthorityAccount}, Decimals: ${decimals}`);

      const mintAuthorityPublicKey = new PublicKey(mintAuthorityAccount);
      const recipientPublicKey = new PublicKey(recipientAddress);
      const mintPublicKey = new PublicKey(mintAddress);

      // Validate mint address
      const mintInfo = await this.connection.getAccountInfo(mintPublicKey);
      if (!mintInfo) {
        throw new Error(`Invalid mint address: ${mintAddress}`);
      }
      this.logger.log('Mint address is valid');

      // Get associated token account for recipient
      const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);
      this.logger.log(`Recipient token account: ${recipientTokenAccount.toBase58()}`);

      // Check if recipient's associated token account exists
      const recipientTokenAccountInfo = await this.connection.getAccountInfo(recipientTokenAccount);
      this.logger.log(`Recipient token account exists: ${!!recipientTokenAccountInfo}`);

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: mintAuthorityPublicKey,
        recentBlockhash: blockhash,
      });

      // If recipient's token account doesn't exist, create it
      if (!recipientTokenAccountInfo) {
        this.logger.log('Creating associated token account for recipient');
        const createAtaInstruction = createAssociatedTokenAccountInstruction(
          mintAuthorityPublicKey, // payer
          recipientTokenAccount, // associated token account
          recipientPublicKey, // owner
          mintPublicKey, // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        transaction.add(createAtaInstruction);
      }

      // Convert amount to smallest unit
      const mintAmount = Math.floor(amount * Math.pow(10, decimals));
      this.logger.log(`Mint amount (smallest unit): ${mintAmount}`);

      if (mintAmount <= 0) {
        throw new Error(`Mint amount too small: ${amount} with ${decimals} decimals results in ${mintAmount} smallest units`);
      }

      // Create mint instruction
      const mintInstruction = createMintToInstruction(
        mintPublicKey, // mint
        recipientTokenAccount, // destination
        mintAuthorityPublicKey, // authority
        mintAmount, // amount
        [], // multiSigners
        TOKEN_PROGRAM_ID
      );

      transaction.add(mintInstruction);

      // Serialize transaction
      const serializedTransaction = Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');

      this.logger.log(`SPL token mint transaction created successfully`);

      return serializedTransaction;
    } catch (error) {
      this.logger.error('Failed to create SPL token mint transaction:', error);
      throw new Error(`Failed to create SPL mint: ${error.message}`);
    }
  }

  /**
   * Creates a token creation transaction with Metaplex metadata
   */
  async createTokenCreationTransaction(params: any, userAccount: string): Promise<string> {
    // Merge the userAccount into the params expected by MetaplexService
    const createParams: CreateTokenParams = {
      ...params,
      userAccount: userAccount, // Inject the user account here
      // Handle defaults if they are missing in params
      recipientAddress: params.recipientAddress || userAccount
    };
    return this.metaplexService.createTokenWithMetadata(createParams);
  }

  /**
   * Creates an NFT collection creation transaction
   */
  async createNftCollectionTransaction(params: any): Promise<string> {
    return this.metaplexService.createNftCollection(params);
  }

  /**
   * Creates an NFT mint transaction from collection
   */
  async createNftMintTransaction(params: any): Promise<string> {
    return this.metaplexService.mintNftFromCollection(params);
  }

  /**
   * Creates a batch airdrop transaction
   */
  async createBatchAirdropTransaction(params: any): Promise<string> {
    try {
      this.logger.log(`Creating batch airdrop transaction for mint: ${params.mintAddress}`);

      const mintPublicKey = new PublicKey(params.mintAddress);
      const recipients = params.recipients || [];
      const decimals = params.decimals || 9;
      const payerAddress = params.payerAddress || params.authorityAddress; // Use authority as payer if not specified

      // Validate inputs
      if (!payerAddress) {
        throw new Error('Batch airdrop requires payerAddress or authorityAddress parameter');
      }

      const payerPublicKey = new PublicKey(payerAddress);
      const authorityPublicKey = new PublicKey(params.authorityAddress);

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: payerPublicKey,
        recentBlockhash: blockhash,
      });

      // Add instructions for each recipient
      for (const recipient of recipients) {
        const recipientPublicKey = new PublicKey(recipient.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);

        // Check if token account exists
        const tokenAccountInfo = await this.connection.getAccountInfo(recipientTokenAccount);

        // Create ATA if it doesn't exist
        if (!tokenAccountInfo) {
          this.logger.log(`Creating ATA for recipient: ${recipient.address}`);
          const createAtaInstruction = createAssociatedTokenAccountInstruction(
            payerPublicKey, // payer
            recipientTokenAccount, // associated token account
            recipientPublicKey, // owner
            mintPublicKey, // mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          transaction.add(createAtaInstruction);
        }

        // Convert amount to smallest unit
        const amount = Math.floor(recipient.amount * Math.pow(10, decimals));

        if (amount <= 0) {
          throw new Error(`Invalid amount for recipient ${recipient.address}: ${recipient.amount}`);
        }

        // Create mint instruction
        const mintInstruction = createMintToInstruction(
          mintPublicKey,
          recipientTokenAccount,
          authorityPublicKey, // mint authority
          amount,
          [], // multiSigners
          TOKEN_PROGRAM_ID
        );

        transaction.add(mintInstruction);
      }

      // Check transaction size limit (Solana limit is ~1232 bytes for legacy transactions)
      const serializedSize = transaction.serialize({ requireAllSignatures: false }).length;
      if (serializedSize > 1000) { // Conservative limit
        throw new Error(`Transaction too large: ${serializedSize} bytes. Reduce number of recipients.`);
      }

      // Serialize transaction
      const serializedTransaction = Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');

      this.logger.log(`Batch airdrop transaction created for ${recipients.length} recipients (${serializedSize} bytes)`);
      return serializedTransaction;
    } catch (error) {
      this.logger.error('Failed to create batch airdrop transaction:', error);
      throw new Error(`Failed to create batch airdrop: ${error.message}`);
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
    this.logger.log(`[TransactionBuilder] Creating ${transactionType} transaction for account: ${account}`);
    this.logger.log(`[TransactionBuilder] Parameters:`, JSON.stringify(parameters, null, 2));

    // Validate account parameter BEFORE any transaction creation
    const accountValidation = this.validateSolanaAddressStrict(account);
    if (!accountValidation.valid) {
      this.logger.error(`[TransactionBuilder] Invalid account parameter: ${accountValidation.error}`);
      throw new Error(`Transaction creation failed: Invalid sender account - ${accountValidation.error}`);
    }

    let transaction: string;
    switch (transactionType) {
      case 'SYSTEM_TRANSFER':
        transaction = await this.createSystemTransferTransaction(
          account,
          parameters.recipientAddress,
          parameters.amount
        );
        break;

      case 'SPL_TRANSFER':
        this.logger.log('SPL_TRANSFER requested with parameters:', parameters);
        if (!parameters.recipientAddress) {
          throw new Error('SPL_TRANSFER requires recipientAddress parameter');
        }
        if (!parameters.mintAddress) {
          throw new Error('SPL_TRANSFER requires mintAddress parameter');
        }
        if (parameters.amount === undefined || parameters.amount === null) {
          throw new Error('SPL_TRANSFER requires amount parameter');
        }

        // Validate addresses
        const splRecipientValidation = this.validateSolanaAddressStrict(parameters.recipientAddress);
        if (!splRecipientValidation.valid) {
          throw new Error(`SPL_TRANSFER invalid recipientAddress: ${splRecipientValidation.error}`);
        }
        const splMintValidation = this.validateSolanaAddressStrict(parameters.mintAddress);
        if (!splMintValidation.valid) {
          throw new Error(`SPL_TRANSFER invalid mintAddress: ${splMintValidation.error}`);
        }

        transaction = await this.createSplTransferTransaction(
          account,
          parameters.recipientAddress,
          parameters.mintAddress,
          parameters.amount,
          parameters.decimals || 9
        );
        break;

      case 'SPL_MINT':
      case 'MINT_TOKENS': {
        this.logger.log(`${transactionType} requested with parameters:`, parameters);

        // Validate required parameters
        const mintValidation = this.validateSolanaAddressStrict(parameters.mintAddress);
        if (!mintValidation.valid) {
          throw new Error(`${transactionType} invalid mintAddress: ${mintValidation.error}`);
        }
        const recipientValidation = this.validateSolanaAddressStrict(parameters.recipientAddress);
        if (!recipientValidation.valid) {
          throw new Error(`${transactionType} invalid recipientAddress: ${recipientValidation.error}`);
        }
        if (!this.validateAmount(parameters.amount)) {
          throw new Error(`${transactionType} requires valid amount parameter`);
        }
        if (parameters.decimals !== undefined && !this.validateDecimals(parameters.decimals)) {
          throw new Error(`${transactionType} requires valid decimals parameter (0-9)`);
        }

        transaction = await this.createSplMintTransaction(
          account, // mint authority
          parameters.mintAddress,
          parameters.recipientAddress,
          parameters.amount,
          parameters.decimals || 9
        );
        break;
      }

      case 'CREATE_TOKEN': {
        this.logger.log('CREATE_TOKEN requested with parameters:', parameters);

        // Validate required parameters
        if (!parameters.name || typeof parameters.name !== 'string' || parameters.name.trim().length === 0) {
          throw new Error('CREATE_TOKEN requires valid name parameter');
        }
        if (!parameters.symbol || typeof parameters.symbol !== 'string' || parameters.symbol.trim().length === 0) {
          throw new Error('CREATE_TOKEN requires valid symbol parameter');
        }
        if (!this.validateAmount(parameters.initialSupply)) {
          throw new Error('CREATE_TOKEN requires valid initialSupply parameter');
        }
        const recipientValidation = this.validateSolanaAddressStrict(parameters.recipientAddress);
        if (!recipientValidation.valid) {
          throw new Error(`CREATE_TOKEN invalid recipientAddress: ${recipientValidation.error}`);
        }
        if (parameters.uri && !this.validateUri(parameters.uri)) {
          throw new Error('CREATE_TOKEN requires valid URI parameter');
        }
        if (parameters.decimals !== undefined && !this.validateDecimals(parameters.decimals)) {
          throw new Error('CREATE_TOKEN requires valid decimals parameter (0-9)');
        }

        transaction = await this.createTokenCreationTransaction(parameters, account);
        break;
      }

      case 'CREATE_NFT_COLLECTION':
        this.logger.log('CREATE_NFT_COLLECTION requested with parameters:', parameters);
        if (!parameters.name) {
          throw new Error('CREATE_NFT_COLLECTION requires name parameter');
        }
        if (!parameters.symbol) {
          throw new Error('CREATE_NFT_COLLECTION requires symbol parameter');
        }
        if (!parameters.uri) {
          throw new Error('CREATE_NFT_COLLECTION requires uri parameter');
        }
        transaction = await this.createNftCollectionTransaction(parameters);
        break;

      case 'MINT_NFT':
        this.logger.log('MINT_NFT requested with parameters:', parameters);
        if (!parameters.collectionAddress) {
          throw new Error('MINT_NFT requires collectionAddress parameter');
        }
        if (!parameters.name) {
          throw new Error('MINT_NFT requires name parameter');
        }
        if (!parameters.uri) {
          throw new Error('MINT_NFT requires uri parameter');
        }
        if (!parameters.recipientAddress) {
          throw new Error('MINT_NFT requires recipientAddress parameter');
        }

        // Validate addresses
        const nftCollectionValidation = this.validateSolanaAddressStrict(parameters.collectionAddress);
        if (!nftCollectionValidation.valid) {
          throw new Error(`MINT_NFT invalid collectionAddress: ${nftCollectionValidation.error}`);
        }
        const nftRecipientValidation = this.validateSolanaAddressStrict(parameters.recipientAddress);
        if (!nftRecipientValidation.valid) {
          throw new Error(`MINT_NFT invalid recipientAddress: ${nftRecipientValidation.error}`);
        }

        transaction = await this.createNftMintTransaction(parameters);
        break;

      case 'BATCH_AIRDROP':
        this.logger.log('BATCH_AIRDROP requested with parameters:', parameters);

        // Validate required parameters
        const airdropMintValidation = this.validateSolanaAddressStrict(parameters.mintAddress);
        if (!airdropMintValidation.valid) {
          throw new Error(`BATCH_AIRDROP invalid mintAddress: ${airdropMintValidation.error}`);
        }
        if (!parameters.recipients || !Array.isArray(parameters.recipients) || parameters.recipients.length === 0) {
          throw new Error('BATCH_AIRDROP requires non-empty recipients array parameter');
        }

        // Validate each recipient
        for (let i = 0; i < parameters.recipients.length; i++) {
          const recipient = parameters.recipients[i];
          const recipientValidation = this.validateSolanaAddressStrict(recipient.address);
          if (!recipientValidation.valid) {
            throw new Error(`BATCH_AIRDROP recipient ${i} invalid address: ${recipientValidation.error}`);
          }
          if (!this.validateAmount(recipient.amount)) {
            throw new Error(`BATCH_AIRDROP recipient ${i} has invalid amount: ${recipient.amount}`);
          }
        }

        if (parameters.decimals !== undefined && !this.validateDecimals(parameters.decimals)) {
          throw new Error('BATCH_AIRDROP requires valid decimals parameter (0-9)');
        }

        transaction = await this.createBatchAirdropTransaction(parameters);
        break;

      case 'CUSTOM_CALL':
        // For now, fall back to memo - custom calls require program-specific logic
        this.logger.warn('CUSTOM_CALL not implemented yet, using memo fallback');
        transaction = await this.createMemoTransaction(account, `Custom call request: ${JSON.stringify(parameters)}`);
        break;

      default:
        this.logger.warn(`Unknown transaction type: ${transactionType}, using memo fallback`);
        transaction = await this.createMemoTransaction(account, `Unknown transaction: ${transactionType} - ${JSON.stringify(parameters)}`);
        break;
    }

    this.logger.log(`[TransactionBuilder] Transaction created successfully for ${transactionType}`);
    this.logger.log(`[TransactionBuilder] Transaction length: ${transaction.length} characters`);

    // Basic validation - check if it's valid base64
    try {
      Buffer.from(transaction, 'base64');
      this.logger.log(`[TransactionBuilder] Transaction is valid base64`);
    } catch (error) {
      this.logger.error(`[TransactionBuilder] Invalid base64 transaction: ${error.message}`);
      throw new Error(`Invalid transaction format: ${error.message}`);
    }

    return transaction;
  }

  /**
   * Get connection instance for testing or advanced usage
   */
  getConnection(): Connection {
    return this.connection;
  }
}
