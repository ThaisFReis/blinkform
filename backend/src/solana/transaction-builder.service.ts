import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  Connection,
  PublicKey,
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
import { MetaplexService } from './metaplex.service';
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

  private validateSolanaAddressStrict(address: string): { valid: boolean; error?: string } {
    return validateSolanaAddress(address);
  }

  private validateAmount(amount: number, decimals: number = 9): boolean {
    if (amount <= 0 || !isFinite(amount)) return false;
    const smallestUnit = amount * Math.pow(10, decimals);
    const maxAmount = Math.pow(2, 64) - 1; 
    return smallestUnit > 0 && smallestUnit <= maxAmount && Number.isInteger(smallestUnit);
  }

  private validateDecimals(decimals: number): boolean {
    return Number.isInteger(decimals) && decimals >= 0 && decimals <= 9;
  }

  private validateUri(uri: string): boolean {
    try {
      new URL(uri);
      return uri.startsWith('http://') || uri.startsWith('https://');
    } catch {
      return false;
    }
  }

  async createMemoTransaction(account: string, memo: string): Promise<string> {
    try {
      this.logger.log(`Creating memo transaction for account: ${account}`);
      
      const memoSize = Buffer.from(memo, 'utf-8').length;
      const MAX_MEMO_SIZE = 566;
      let finalMemo = memo;
      
      if (memoSize > MAX_MEMO_SIZE) {
        finalMemo = memo.substring(0, MAX_MEMO_SIZE - 3) + '...';
      }

      const userPublicKey = new PublicKey(account);
      const { blockhash } = await this.connection.getLatestBlockhash();

      const memoInstruction = new TransactionInstruction({
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
        keys: [{ pubkey: userPublicKey, isSigner: true, isWritable: false }],
        data: Buffer.from(finalMemo, 'utf-8'),
      });

      const transaction = new Transaction({
        feePayer: userPublicKey,
        recentBlockhash: blockhash,
      }).add(memoInstruction);

      return Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');
    } catch (error) {
      this.logger.error('Failed to create memo transaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async createSystemTransferTransaction(
    fromAccount: string,
    toAccount: string,
    amount: number
  ): Promise<string> {
    try {
      const fromValidation = this.validateSolanaAddressStrict(fromAccount);
      if (!fromValidation.valid) throw new Error(`Invalid sender: ${fromValidation.error}`);

      const toValidation = this.validateSolanaAddressStrict(toAccount);
      if (!toValidation.valid) throw new Error(`Invalid recipient: ${toValidation.error}`);

      const fromPublicKey = new PublicKey(fromAccount);
      const toPublicKey = new PublicKey(toAccount);
      const lamports = amount * LAMPORTS_PER_SOL;
      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: fromPublicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports,
        })
      );

      return Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');
    } catch (error) {
      this.logger.error('Failed to create SOL transfer:', error);
      throw new Error(`Failed to create SOL transfer: ${error.message}`);
    }
  }

  async createSplTransferTransaction(
    fromAccount: string,
    toAccount: string,
    mintAddress: string,
    amount: number,
    decimals: number = 9
  ): Promise<string> {
    try {
      const fromPublicKey = new PublicKey(fromAccount);
      const toPublicKey = new PublicKey(toAccount);
      const mintPublicKey = new PublicKey(mintAddress);

      const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, fromPublicKey);
      const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

      const fromTokenAccountInfo = await this.connection.getAccountInfo(fromTokenAccount);
      if (!fromTokenAccountInfo) {
        throw new Error(`Sender does not have token account for mint ${mintAddress}`);
      }

      const toTokenAccountInfo = await this.connection.getAccountInfo(toTokenAccount);
      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: fromPublicKey,
        recentBlockhash: blockhash,
      });

      if (!toTokenAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            fromPublicKey,
            toTokenAccount,
            toPublicKey,
            mintPublicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      const transferAmount = Math.floor(amount * Math.pow(10, decimals));
      if (transferAmount <= 0) throw new Error(`Transfer amount too small`);

      transaction.add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          fromPublicKey,
          transferAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      return Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');
    } catch (error) {
      this.logger.error('Failed to create SPL transfer:', error);
      throw new Error(`Failed to create SPL transfer: ${error.message}`);
    }
  }

  async createSplMintTransaction(
    mintAuthorityAccount: string,
    mintAddress: string,
    recipientAddress: string,
    amount: number,
    decimals: number = 9
  ): Promise<string> {
    try {
      const mintAuthorityPublicKey = new PublicKey(mintAuthorityAccount);
      const recipientPublicKey = new PublicKey(recipientAddress);
      const mintPublicKey = new PublicKey(mintAddress);

      const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);
      const recipientTokenAccountInfo = await this.connection.getAccountInfo(recipientTokenAccount);
      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: mintAuthorityPublicKey,
        recentBlockhash: blockhash,
      });

      if (!recipientTokenAccountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            mintAuthorityPublicKey,
            recipientTokenAccount,
            recipientPublicKey,
            mintPublicKey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      const mintAmount = Math.floor(amount * Math.pow(10, decimals));
      if (mintAmount <= 0) throw new Error(`Mint amount too small`);

      transaction.add(
        createMintToInstruction(
          mintPublicKey,
          recipientTokenAccount,
          mintAuthorityPublicKey,
          mintAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      return Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');
    } catch (error) {
      this.logger.error('Failed to create SPL mint:', error);
      throw new Error(`Failed to create SPL mint: ${error.message}`);
    }
  }

  async createTokenCreationTransaction(params: any, userAccount: string): Promise<string> {
    const createParams = {
      ...params,
      userAccount,
      recipientAddress: params.recipientAddress || userAccount 
    };
    return this.metaplexService.createTokenWithMetadata(createParams);
  }

  async createNftCollectionTransaction(params: any, userAccount: string): Promise<string> {
    // Passing userAccount for future extensibility
    return this.metaplexService.createNftCollection(params);
  }

  async createNftMintTransaction(params: any, userAccount: string): Promise<string> {
    // Passing userAccount for future extensibility
    return this.metaplexService.mintNftFromCollection(params);
  }

  // --- UPDATED METHOD ---
  async createBatchAirdropTransaction(params: any, userAccount: string): Promise<string> {
    try {
      this.logger.log(`Creating batch airdrop transaction for mint: ${params.mintAddress}`);

      const mintPublicKey = new PublicKey(params.mintAddress);
      const recipients = params.recipients || [];
      const decimals = params.decimals || 9;
      
      // Default payer to userAccount if not explicitly overridden in params
      const payerAddress = params.payerAddress || userAccount;
      const authorityAddress = params.authorityAddress || userAccount;

      const payerPublicKey = new PublicKey(payerAddress);
      const authorityPublicKey = new PublicKey(authorityAddress);

      const { blockhash } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: payerPublicKey,
        recentBlockhash: blockhash,
      });

      for (const recipient of recipients) {
        const recipientPublicKey = new PublicKey(recipient.address);
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);

        const tokenAccountInfo = await this.connection.getAccountInfo(recipientTokenAccount);

        if (!tokenAccountInfo) {
          transaction.add(
            createAssociatedTokenAccountInstruction(
              payerPublicKey,
              recipientTokenAccount,
              recipientPublicKey,
              mintPublicKey,
              TOKEN_PROGRAM_ID,
              ASSOCIATED_TOKEN_PROGRAM_ID
            )
          );
        }

        const amount = Math.floor(recipient.amount * Math.pow(10, decimals));
        if (amount <= 0) throw new Error(`Invalid amount for recipient ${recipient.address}`);

        transaction.add(
          createMintToInstruction(
            mintPublicKey,
            recipientTokenAccount,
            authorityPublicKey,
            amount,
            [],
            TOKEN_PROGRAM_ID
          )
        );
      }

      const serializedSize = transaction.serialize({ requireAllSignatures: false }).length;
      if (serializedSize > 1200) { // Solana max is ~1232
        throw new Error(`Transaction too large: ${serializedSize} bytes. Reduce number of recipients.`);
      }

      return Buffer.from(transaction.serialize({ requireAllSignatures: false })).toString('base64');
    } catch (error) {
      this.logger.error('Failed to create batch airdrop transaction:', error);
      throw new Error(`Failed to create batch airdrop: ${error.message}`);
    }
  }

  async createTransaction(
    transactionType: string,
    account: string,
    parameters: any
  ): Promise<string> {
    this.logger.log(`[TransactionBuilder] Creating ${transactionType} transaction for account: ${account}`);
    this.logger.log(`[TransactionBuilder] Parameters:`, JSON.stringify(parameters, null, 2));

    const accountValidation = this.validateSolanaAddressStrict(account);
    if (!accountValidation.valid) {
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
        if (!parameters.recipientAddress) throw new Error('SPL_TRANSFER requires recipientAddress');
        if (!parameters.mintAddress) throw new Error('SPL_TRANSFER requires mintAddress');
        
        const splRecipientValidation = this.validateSolanaAddressStrict(parameters.recipientAddress);
        if (!splRecipientValidation.valid) throw new Error(`Invalid recipientAddress: ${splRecipientValidation.error}`);
        
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
        const mintValidation = this.validateSolanaAddressStrict(parameters.mintAddress);
        if (!mintValidation.valid) throw new Error(`Invalid mintAddress: ${mintValidation.error}`);
        
        transaction = await this.createSplMintTransaction(
          account, // user is mint authority and fee payer
          parameters.mintAddress,
          parameters.recipientAddress,
          parameters.amount,
          parameters.decimals || 9
        );
        break;
      }

      case 'CREATE_TOKEN': {
        // Validation handled in validations section, strict checks
        this.logger.log('CREATE_TOKEN requested with parameters:', parameters);

        if (!parameters.name) throw new Error('CREATE_TOKEN requires name');
        
         if (!this.validateAmount(parameters.initialSupply)) {
          throw new Error('CREATE_TOKEN requires valid initialSupply parameter');
        }

        // SAFETY FIX: Ensure initialSupply is a number before passing to Metaplex
        const sanitizedParams = {
            ...parameters,
            initialSupply: Number(parameters.initialSupply),
            decimals: Number(parameters.decimals || 9)
        };

        transaction = await this.createTokenCreationTransaction(sanitizedParams, account);
        break;
      }

      case 'CREATE_NFT_COLLECTION':
        transaction = await this.createNftCollectionTransaction(parameters, account);
        break;

      case 'MINT_NFT':
        transaction = await this.createNftMintTransaction(parameters, account);
        break;

      case 'BATCH_AIRDROP':
        const airdropMintValidation = this.validateSolanaAddressStrict(parameters.mintAddress);
        if (!airdropMintValidation.valid) throw new Error(`Invalid mintAddress: ${airdropMintValidation.error}`);
        
        // Pass account so user pays for airdrop fees
        transaction = await this.createBatchAirdropTransaction(parameters, account);
        break;

      case 'CUSTOM_CALL':
        this.logger.warn('CUSTOM_CALL not implemented yet, using memo fallback');
        transaction = await this.createMemoTransaction(account, `Custom call: ${JSON.stringify(parameters)}`);
        break;

      default:
        this.logger.warn(`Unknown transaction type: ${transactionType}, using memo fallback`);
        transaction = await this.createMemoTransaction(account, `Unknown: ${transactionType}`);
        break;
    }

    return transaction;
  }

  getConnection(): Connection {
    return this.connection;
  }
}