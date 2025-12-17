import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Keypair, PublicKey } from '@solana/web3.js';

@Injectable()
export class KeypairService implements OnModuleInit {
  private readonly logger = new Logger(KeypairService.name);
  private mintAuthority: Keypair;
  private collectionAuthority: Keypair;

  onModuleInit() {
    this.loadKeypairs();
  }

  private loadKeypairs() {
    try {
      // Load mint authority keypair
      const mintKeyJson = process.env.MINT_AUTHORITY_PRIVATE_KEY;
      if (!mintKeyJson) {
        this.logger.warn('MINT_AUTHORITY_PRIVATE_KEY environment variable not set. Metaplex features will not be available.');
        // Create a dummy keypair for development - this will not work for real transactions
        this.mintAuthority = Keypair.generate();
        this.collectionAuthority = this.mintAuthority;
        return;
      }

      const mintKeyArray = JSON.parse(mintKeyJson);
      if (!Array.isArray(mintKeyArray) || mintKeyArray.length !== 64) {
        throw new Error('MINT_AUTHORITY_PRIVATE_KEY must be a JSON array of 64 numbers');
      }

      this.mintAuthority = Keypair.fromSecretKey(new Uint8Array(mintKeyArray));
      this.logger.log(`Mint authority loaded: ${this.mintAuthority.publicKey.toBase58()}`);

      // Load collection authority (defaults to mint authority if not set)
      const collectionKeyJson = process.env.COLLECTION_AUTHORITY_PRIVATE_KEY;
      if (collectionKeyJson) {
        const collectionKeyArray = JSON.parse(collectionKeyJson);
        if (!Array.isArray(collectionKeyArray) || collectionKeyArray.length !== 64) {
          throw new Error('COLLECTION_AUTHORITY_PRIVATE_KEY must be a JSON array of 64 numbers');
        }
        this.collectionAuthority = Keypair.fromSecretKey(new Uint8Array(collectionKeyArray));
        this.logger.log(`Collection authority loaded: ${this.collectionAuthority.publicKey.toBase58()}`);
      } else {
        this.collectionAuthority = this.mintAuthority;
        this.logger.log('Collection authority defaults to mint authority');
      }

    } catch (error) {
      this.logger.error('Failed to load keypairs:', error);
      // Create dummy keypairs for development
      this.mintAuthority = Keypair.generate();
      this.collectionAuthority = this.mintAuthority;
      this.logger.warn('Using generated keypairs for development. Metaplex features will not work properly.');
    }
  }

  getMintAuthority(): Keypair {
    return this.mintAuthority;
  }

  getCollectionAuthority(): Keypair {
    return this.collectionAuthority;
  }

  async validateAuthority(mintAddress: string): Promise<boolean> {
    try {
      const mintPublicKey = new PublicKey(mintAddress);
      // Note: In a real implementation, you would check if the mint authority
      // matches the expected authority. For now, just validate the address format.
      return true;
    } catch (error) {
      this.logger.error(`Invalid mint address: ${mintAddress}`, error);
      return false;
    }
  }

  // Method for keypair rotation (future enhancement)
  rotateMintAuthority(newKeypair: Keypair): void {
    this.mintAuthority = newKeypair;
    this.logger.log(`Mint authority rotated to: ${newKeypair.publicKey.toBase58()}`);
  }

  rotateCollectionAuthority(newKeypair: Keypair): void {
    this.collectionAuthority = newKeypair;
    this.logger.log(`Collection authority rotated to: ${newKeypair.publicKey.toBase58()}`);
  }
}