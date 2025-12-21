import { Injectable, Logger, Inject } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import { Connection } from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  Umi,
  publicKey,
  some,
  transactionBuilder,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
  percentAmount,
  createNoopSigner,
} from '@metaplex-foundation/umi';
import { 
  mplTokenMetadata, 
  createNft, 
  createV1, 
  mintV1,
  updateV1,
  TokenStandard 
} from '@metaplex-foundation/mpl-token-metadata';
import { fromWeb3JsPublicKey, toWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

export interface CreateTokenParams {
  name: string;
  symbol: string;
  decimals?: number;
  uri?: string;
  initialSupply: number;
  recipientAddress: string;
  userAccount: string;
}

export interface CreateCollectionParams {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints?: number;
}

export interface MintNftParams {
  collectionAddress: string;
  name: string;
  uri: string;
  recipientAddress: string;
}

export interface UpdateMetadataParams {
  mintAddress: string;
  name?: string;
  symbol?: string;
  uri?: string;
}

export interface BurnTokensParams {
  mintAddress: string;
  amount: number;
  ownerAddress: string;
  decimals?: number;
}

export interface FreezeTokenAccountParams {
  mintAddress: string;
  accountAddress: string;
  freeze: boolean; // true to freeze, false to thaw
}

@Injectable()
export class MetaplexService {
  private readonly logger = new Logger(MetaplexService.name);
  private umi: Umi;
  private connection: Connection;

  constructor(
    @Inject(KeypairService) private keypairService: KeypairService,
  ) {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.umi = createUmi(rpcUrl);

    this.ensureSignerIdentity();

    try {
      this.umi.use(mplTokenMetadata());
      this.logger.log('mplTokenMetadata plugin installed successfully');
    } catch (error) {
      this.logger.error('Failed to install Metaplex plugins:', error);
      throw error;
    }
  }

  private ensureSignerIdentity() {
    const mintAuthority = this.keypairService.getMintAuthority();
    if (mintAuthority) {
      const umiSigner = createSignerFromKeypair(this.umi, {
        publicKey: fromWeb3JsPublicKey(mintAuthority.publicKey),
        secretKey: mintAuthority.secretKey,
      });
      this.umi.use(signerIdentity(umiSigner));
    } else {
      const dummySigner = generateSigner(this.umi);
      this.umi.use(signerIdentity(dummySigner));
    }
  }

  async createTokenWithMetadata(params: CreateTokenParams): Promise<string> {
    try {
      this.logger.log(`Creating token: ${params.name} (${params.symbol}) for user ${params.userAccount}`);

      // 1. Create a "No-Op" Signer for the User
      const userPublicKey = publicKey(params.userAccount);
      const userSigner = createNoopSigner(userPublicKey);

      // 2. Generate the Mint Keypair
      const mint = generateSigner(this.umi);

      // 3. Determine Recipient (Default to User)
      const recipient = params.recipientAddress ? publicKey(params.recipientAddress) : userPublicKey;

      // 4. Build the Transaction
      // We explicitly set the User as the authority and payer.
      let builder = transactionBuilder()
        .add(
          createV1(this.umi, {
            mint: mint,
            authority: userSigner,       // User is Authority
            payer: userSigner,           // User pays fee
            updateAuthority: userSigner, // User keeps control
            name: params.name,
            symbol: params.symbol,
            uri: params.uri || '',
            sellerFeeBasisPoints: percentAmount(0),
            decimals: some(params.decimals || 9),
            tokenStandard: TokenStandard.Fungible,
          })
        );

      // 5. Add Mint Instruction if initial supply > 0
      if (params.initialSupply > 0) {
        builder = builder.add(
          mintV1(this.umi, {
            mint: mint.publicKey,
            authority: userSigner,
            amount: params.initialSupply,
            tokenOwner: recipient,
            tokenStandard: TokenStandard.Fungible,
          })
        );
      }

      // 6. Build and Sign (Partial)
      const umiTx = await builder.buildAndSign(this.umi);

      // 7. Serialize
      // VersionedTransaction.serialize() takes NO arguments.
      // It does not enforce all signatures by default during serialization.
      const web3Tx = toWeb3JsTransaction(umiTx);
      const serialized = Buffer.from(web3Tx.serialize()).toString('base64');

      this.logger.log(`Token creation transaction built. Mint Address: ${mint.publicKey}`);
      return serialized;
    } catch (error) {
      this.logger.error('Failed to create token with metadata:', error);
      throw new Error(`Failed to create token: ${error.message}`);
    }
  }

  async createNftCollection(params: CreateCollectionParams): Promise<string> {
    try {
      this.logger.log(`Creating NFT collection: ${params.name} (${params.symbol})`);

      const collectionMint = generateSigner(this.umi);

      const tx = transactionBuilder()
        .add(
          createV1(this.umi, {
            mint: collectionMint,
            authority: this.umi.identity,
            name: params.name,
            symbol: params.symbol,
            uri: params.uri,
            sellerFeeBasisPoints: percentAmount(params.sellerFeeBasisPoints || 5),
            decimals: some(0),
            tokenStandard: TokenStandard.ProgrammableNonFungible,
            isCollection: true,
          })
        );

      const umiTx = await tx.buildAndSign(this.umi);
      const web3Tx = toWeb3JsTransaction(umiTx);
      
      // Fix: removed argument
      const serialized = Buffer.from(web3Tx.serialize()).toString('base64');

      this.logger.log(`NFT collection creation transaction created: ${collectionMint.publicKey}`);
      return serialized;
    } catch (error) {
      this.logger.error('Failed to create NFT collection:', error);
      throw new Error(`Failed to create collection: ${error.message}`);
    }
  }

  async mintNftFromCollection(params: MintNftParams): Promise<string> {
    try {
      this.logger.log(`Minting NFT from collection: ${params.collectionAddress}`);

      const collectionMint = publicKey(params.collectionAddress);
      const nftMint = generateSigner(this.umi);

      const tx = transactionBuilder()
        .add(
          createNft(this.umi, {
            mint: nftMint,
            authority: this.umi.identity,
            name: params.name,
            uri: params.uri,
            sellerFeeBasisPoints: percentAmount(5),
            collection: some({ verified: false, key: collectionMint }),
          })
        );

      const umiTx = await tx.buildAndSign(this.umi);
      const web3Tx = toWeb3JsTransaction(umiTx);
      
      // Fix: removed argument
      const serialized = Buffer.from(web3Tx.serialize()).toString('base64');

      this.logger.log(`NFT mint transaction created: ${nftMint.publicKey}`);
      return serialized;
    } catch (error) {
      this.logger.error('Failed to mint NFT from collection:', error);
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  async updateTokenMetadata(params: UpdateMetadataParams): Promise<string> {
    try {
      this.logger.log(`Updating metadata for token: ${params.mintAddress}`);

      const mint = publicKey(params.mintAddress);

      const updateData: any = {};
      if (params.name !== undefined) updateData.name = params.name;
      if (params.symbol !== undefined) updateData.symbol = params.symbol;
      if (params.uri !== undefined) updateData.uri = params.uri;

      const tx = transactionBuilder()
        .add(
          updateV1(this.umi, {
            mint,
            authority: this.umi.identity,
            data: updateData,
          })
        );

      const umiTx = await tx.buildAndSign(this.umi);
      const web3Tx = toWeb3JsTransaction(umiTx);
      
      // Fix: removed argument
      const serialized = Buffer.from(web3Tx.serialize()).toString('base64');

      this.logger.log(`Metadata update transaction created for: ${params.mintAddress}`);
      return serialized;
    } catch (error) {
      this.logger.error('Failed to update token metadata:', error);
      throw new Error(`Failed to update metadata: ${error.message}`);
    }
  }

  async burnTokens(params: BurnTokensParams): Promise<string> {
    try {
      this.logger.log(`Burning ${params.amount} tokens from ${params.ownerAddress}`);
      throw new Error('Token burning not yet implemented - requires SPL token integration');
    } catch (error) {
      this.logger.error('Failed to burn tokens:', error);
      throw new Error(`Failed to burn tokens: ${error.message}`);
    }
  }

  async freezeTokenAccount(params: FreezeTokenAccountParams): Promise<string> {
    try {
      this.logger.log(`${params.freeze ? 'Freezing' : 'Thawing'} token account: ${params.accountAddress}`);
      throw new Error('Token freeze/thaw not yet implemented - requires SPL token integration');
    } catch (error) {
      this.logger.error('Failed to freeze/thaw token account:', error);
      throw new Error(`Failed to freeze/thaw token account: ${error.message}`);
    }
  }

  async transferMintAuthority(params: { mintAddress: string, newAuthority: string }): Promise<string> {
    try {
      this.logger.log(`Transferring mint authority to: ${params.newAuthority}`);
      throw new Error('Authority transfer not yet implemented - requires SPL token integration');
    } catch (error) {
      this.logger.error('Failed to transfer mint authority:', error);
      throw new Error(`Failed to transfer mint authority: ${error.message}`);
    }
  }
}