import { Injectable, Logger, Inject } from '@nestjs/common';
import { KeypairService } from './keypair.service';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
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
import { mplTokenMetadata, createNft, createV1, updateV1 } from '@metaplex-foundation/mpl-token-metadata';
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
// Initialize UMI with RPC URL
this.umi = createUmi(rpcUrl);

// Ensure signer identity is set before adding plugins
this.ensureSignerIdentity();

// Add Metaplex plugins
try {
  this.umi.use(mplTokenMetadata());
  this.logger.log('mplTokenMetadata plugin installed successfully');
} catch (error) {
  this.logger.error('Failed to install Metaplex plugins:', error);
  throw error;
}
    this.logger.log(`Metaplex service initialized with RPC: ${rpcUrl}`);
  }

  private ensureSignerIdentity() {
    const mintAuthority = this.keypairService.getMintAuthority();
    this.logger.log(`Mint authority available: ${!!mintAuthority}`);
    if (mintAuthority) {
      const umiSigner = createSignerFromKeypair(this.umi, {
        publicKey: fromWeb3JsPublicKey(mintAuthority.publicKey),
        secretKey: mintAuthority.secretKey,
      });
      this.umi.use(signerIdentity(umiSigner));
      this.logger.log('Signer identity set with mint authority');
    } else {
      // Generate a dummy signer to avoid NullSigner errors
      const dummySigner = generateSigner(this.umi);
      this.umi.use(signerIdentity(dummySigner));
      this.logger.log('Signer identity set with generated dummy signer');
    }
  }

  async createTokenWithMetadata(params: CreateTokenParams): Promise<string> {
    try {
      this.logger.log(`Creating token: ${params.name} (${params.symbol}) for user ${params.userAccount}`);

      // 1. Define the User as a Signer (NoopSigner)
      // We don't have their secret key, but we know they MUST sign this transaction.
      const userPublicKey = publicKey(params.userAccount);
      const userSigner = createNoopSigner(userPublicKey);

      // 2. Generate a new Keypair for the Mint Account
      // This MUST be signed by the backend because we generated the secret key here.
      const mint = generateSigner(this.umi);

      // 3. Determine Recipient (Default to User if not provided)
      const recipient = params.recipientAddress ? publicKey(params.recipientAddress) : userPublicKey;

      // 4. Build Transaction
      const tx = transactionBuilder()
        .add(
          createV1(this.umi, {
            mint: mint,
            authority: userSigner, // User is the Authority
            payer: userSigner,     // User pays the fees
            updateAuthority: userSigner, // User can update metadata later
            name: params.name,
            symbol: params.symbol,
            uri: params.uri || '',
            sellerFeeBasisPoints: percentAmount(0),
            decimals: some(params.decimals || 9),
            tokenStandard: 0, // Fungible
          })
        );

      // 5. Build and Sign PARTIALLY
      // We only have the 'mint' keypair. We sign with 'mint'.
      // The 'userSigner' is a NoopSigner, so Umi won't try to sign with it,
      // but it will include it in the instruction as a required signer.
      const umiTx = await tx.buildAndSign(this.umi);

      // 6. Convert to Web3.js and Serialize
      const web3Tx = toWeb3JsTransaction(umiTx);

      // IMPORTANT: The transaction now has the Mint's signature.
      // It is missing the User's signature (fee payer/authority).
      // The frontend/wallet will append the user's signature.

      const serialized = Buffer.from(web3Tx.serialize()).toString('base64');

      this.logger.log(`Token creation transaction built. Mint: ${mint.publicKey}`);
      return serialized;

    } catch (error) {
      this.logger.error('Failed to create token with metadata:', error);
      throw new Error(`Failed to create token: ${error.message}`);
    }
  }

  async createNftCollection(params: CreateCollectionParams): Promise<string> {
    try {
      this.logger.log(`Creating NFT collection: ${params.name} (${params.symbol})`);

      const collectionAuthority = this.keypairService.getCollectionAuthority();

      // Generate new collection mint
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
            decimals: some(0), // NFTs have 0 decimals
            tokenStandard: 4, // ProgrammableNonFungible
            isCollection: true,
          })
        );

      // Build and convert to web3.js
      const umiTx = await tx.buildAndSign(this.umi);

      const web3Tx = toWeb3JsTransaction(umiTx);

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
      const recipient = publicKey(params.recipientAddress);

      // Generate new NFT mint
      const nftMint = generateSigner(this.umi);

      const tx = transactionBuilder()
        .add(
          createNft(this.umi, {
            mint: nftMint,
            authority: this.umi.identity,
            name: params.name,
            uri: params.uri,
            sellerFeeBasisPoints: percentAmount(5), // Default 5%
            collection: some({ verified: false, key: collectionMint }),
          })
        );

      // Build and convert to web3.js
      const umiTx = await tx.buildAndSign(this.umi);

      const web3Tx = toWeb3JsTransaction(umiTx);

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

      // Build and convert to web3.js
      const umiTx = await tx.buildAndSign(this.umi);

      const web3Tx = toWeb3JsTransaction(umiTx);

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

      // For token burning, we need to use SPL token instructions
      // This is a simplified implementation - in production you'd want more validation
      throw new Error('Token burning not yet implemented - requires SPL token integration');
    } catch (error) {
      this.logger.error('Failed to burn tokens:', error);
      throw new Error(`Failed to burn tokens: ${error.message}`);
    }
  }

  async freezeTokenAccount(params: FreezeTokenAccountParams): Promise<string> {
    try {
      this.logger.log(`${params.freeze ? 'Freezing' : 'Thawing'} token account: ${params.accountAddress}`);

      // For freeze/thaw, we need to use SPL token instructions
      // This requires freeze authority to be set on the mint
      throw new Error('Token freeze/thaw not yet implemented - requires SPL token integration');
    } catch (error) {
      this.logger.error('Failed to freeze/thaw token account:', error);
      throw new Error(`Failed to freeze/thaw token account: ${error.message}`);
    }
  }

  async transferMintAuthority(params: { mintAddress: string, newAuthority: string }): Promise<string> {
    try {
      this.logger.log(`Transferring mint authority to: ${params.newAuthority}`);

      // This would require SPL token setAuthority instruction
      throw new Error('Authority transfer not yet implemented - requires SPL token integration');
    } catch (error) {
      this.logger.error('Failed to transfer mint authority:', error);
      throw new Error(`Failed to transfer mint authority: ${error.message}`);
    }
  }
}