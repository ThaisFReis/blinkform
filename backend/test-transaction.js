/**
 * Test script to simulate Solana transactions locally
 * This helps debug transaction failures before sending to wallet
 */

const {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  ComputeBudgetProgram,
  TransactionInstruction,
  Transaction,
} = require('@solana/web3.js');


async function testMemoTransaction() {
  console.log('🔍 Testing Solana Memo Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Use your actual wallet address here
  const USER_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your Phantom wallet address

  // Test memo data (similar to what the form creates)
  const memoData = 'FormID:test-form|Answers:{"q1":"Test Answer 1","q2":"Option B"}|Timestamp:1234567890';

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Wallet:', USER_WALLET);
  console.log('  Memo:', memoData);
  console.log('  Memo size:', Buffer.from(memoData, 'utf-8').length, 'bytes\n');

  try {
    // Parse user's public key
    const userPublicKey = new PublicKey(USER_WALLET);
    console.log('✅ Wallet address is valid\n');

    // Get latest blockhash
    console.log('⏳ Fetching latest blockhash...');
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    // Create memo instruction - Method 1: With signer in keys
    console.log('📦 Creating memo instruction (with signer)...');
    const memoInstruction = new TransactionInstruction({
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      keys: [
        {
          pubkey: userPublicKey,
          isSigner: true,
          isWritable: false,
        },
      ],
      data: Buffer.from(memoData, 'utf-8'),
    });

    // Build legacy transaction (more compatible with wallets)
    console.log('🔨 Building transaction...');
    const transaction = new Transaction({
      feePayer: userPublicKey,
      recentBlockhash: blockhash,
    }).add(memoInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ Transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testSolTransfer() {
  console.log('🔍 Testing SOL Transfer Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Use your actual wallet address here
  const USER_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your Phantom wallet address
  const RECIPIENT_WALLET = '11111111111111111111111111111112'; // System program as recipient for testing
  const AMOUNT_SOL = 0.01; // Small amount for testing

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  From:', USER_WALLET);
  console.log('  To:', RECIPIENT_WALLET);
  console.log('  Amount:', AMOUNT_SOL, 'SOL\n');

  try {
    // Parse public keys
    const fromPublicKey = new PublicKey(USER_WALLET);
    const toPublicKey = new PublicKey(RECIPIENT_WALLET);
    console.log('✅ Wallet addresses are valid\n');

    // Get latest blockhash
    console.log('⏳ Fetching latest blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    // Create transfer instruction
    console.log('📦 Creating SOL transfer instruction...');
    const { SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey: toPublicKey,
      lamports: Math.floor(AMOUNT_SOL * LAMPORTS_PER_SOL),
    });

    // Build transaction
    console.log('🔨 Building transaction...');
    const transaction = new Transaction({
      feePayer: fromPublicKey,
      recentBlockhash: blockhash,
    }).add(transferInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ SOL Transfer transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testSplTransfer() {
  console.log('🔍 Testing SPL Token Transfer Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Use devnet USDC mint for testing
  const MINT_ADDRESS = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Devnet USDC
  const USER_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your Phantom wallet address
  const RECIPIENT_WALLET = 'isSereA3nQ97DJXnjNFc1JAFWBF9cdH8W6tvDdogK9W'; // Some other address
  const AMOUNT = 0.01; // Small amount for testing
  const DECIMALS = 6; // USDC has 6 decimals

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Mint:', MINT_ADDRESS);
  console.log('  From:', USER_WALLET);
  console.log('  To:', RECIPIENT_WALLET);
  console.log('  Amount:', AMOUNT, 'tokens');
  console.log('  Decimals:', DECIMALS, '\n');

  try {
    // Import SPL token functions
    const {
      getAssociatedTokenAddress,
      createAssociatedTokenAccountInstruction,
      createTransferInstruction,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    } = require('@solana/spl-token');

    // Parse public keys
    const fromPublicKey = new PublicKey(USER_WALLET);
    const toPublicKey = new PublicKey(RECIPIENT_WALLET);
    const mintPublicKey = new PublicKey(MINT_ADDRESS);
    console.log('✅ Addresses are valid\n');

    // Validate mint
    const mintInfo = await connection.getAccountInfo(mintPublicKey);
    if (!mintInfo) {
      console.log('❌ Mint address not found');
      process.exit(1);
    }
    console.log('✅ Mint address is valid\n');

    // Get associated token accounts
    const fromTokenAccount = await getAssociatedTokenAddress(mintPublicKey, fromPublicKey);
    const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, toPublicKey);

    console.log('📍 Token Accounts:');
    console.log('  From ATA:', fromTokenAccount.toBase58());
    console.log('  To ATA:', toTokenAccount.toBase58());

    // Check accounts
    const fromTokenAccountInfo = await connection.getAccountInfo(fromTokenAccount);
    const toTokenAccountInfo = await connection.getAccountInfo(toTokenAccount);

    console.log('📊 Account Status:');
    console.log('  From ATA exists:', !!fromTokenAccountInfo);
    console.log('  To ATA exists:', !!toTokenAccountInfo);

    if (!fromTokenAccountInfo) {
      console.log('❌ Sender does not have token account for this mint');
      process.exit(1);
    }

    // Get latest blockhash
    console.log('\n⏳ Fetching latest blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    const transaction = new Transaction({
      feePayer: fromPublicKey,
      recentBlockhash: blockhash,
    });

    // If recipient's token account doesn't exist, create it
    if (!toTokenAccountInfo) {
      console.log('📦 Creating associated token account for recipient...');
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
    const transferAmount = Math.floor(AMOUNT * Math.pow(10, DECIMALS));
    console.log(`💰 Transfer amount (smallest unit): ${transferAmount}`);

    if (transferAmount <= 0) {
      console.log('❌ Transfer amount too small');
      process.exit(1);
    }

    // Create transfer instruction
    console.log('📦 Creating token transfer instruction...');
    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPublicKey,
      transferAmount,
      [],
      TOKEN_PROGRAM_ID
    );

    transaction.add(transferInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ SPL Token transfer transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testSplMint() {
  console.log('🔍 Testing SPL Token Mint Transaction...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // For testing, we'll use a mint that we can control
  // This is just a simulation - in real usage, you'd need a mint you control
  const MINT_ADDRESS = 'So11111111111111111111111111111111111111112'; // Wrapped SOL mint (for testing)
  const AUTHORITY_WALLET = '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'; // Your wallet (would need to be mint authority)
  const RECIPIENT_WALLET = 'isSereA3nQ97DJXnjNFc1JAFWBF9cdH8W6tvDdogK9W'; // Recipient
  const AMOUNT = 0.01; // Small amount for testing
  const DECIMALS = 9; // WSOL has 9 decimals

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Mint:', MINT_ADDRESS);
  console.log('  Authority:', AUTHORITY_WALLET);
  console.log('  Recipient:', RECIPIENT_WALLET);
  console.log('  Amount:', AMOUNT, 'tokens');
  console.log('  Decimals:', DECIMALS, '\n');

  console.log('⚠️  Note: This test uses Wrapped SOL mint for simulation.');
  console.log('   In real usage, you need to be the mint authority.\n');

  try {
    // Import SPL token functions
    const {
      getAssociatedTokenAddress,
      createAssociatedTokenAccountInstruction,
      createMintToInstruction,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    } = require('@solana/spl-token');

    // Parse public keys
    const authorityPublicKey = new PublicKey(AUTHORITY_WALLET);
    const recipientPublicKey = new PublicKey(RECIPIENT_WALLET);
    const mintPublicKey = new PublicKey(MINT_ADDRESS);
    console.log('✅ Addresses are valid\n');

    // Validate mint
    const mintInfo = await connection.getAccountInfo(mintPublicKey);
    if (!mintInfo) {
      console.log('❌ Mint address not found');
      process.exit(1);
    }
    console.log('✅ Mint address is valid\n');

    // Get associated token account for recipient
    const recipientTokenAccount = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey);
    console.log('📍 Recipient Token Account:', recipientTokenAccount.toBase58());

    // Check if recipient's token account exists
    const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAccount);
    console.log('📊 Recipient ATA exists:', !!recipientTokenAccountInfo);

    // Get latest blockhash
    console.log('\n⏳ Fetching latest blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();
    console.log('✅ Blockhash:', blockhash, '\n');

    const transaction = new Transaction({
      feePayer: authorityPublicKey,
      recentBlockhash: blockhash,
    });

    // If recipient's token account doesn't exist, create it
    if (!recipientTokenAccountInfo) {
      console.log('📦 Creating associated token account for recipient...');
      const createAtaInstruction = createAssociatedTokenAccountInstruction(
        authorityPublicKey, // payer
        recipientTokenAccount, // associated token account
        recipientPublicKey, // owner
        mintPublicKey, // mint
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      transaction.add(createAtaInstruction);
    }

    // Convert amount to smallest unit
    const mintAmount = Math.floor(AMOUNT * Math.pow(10, DECIMALS));
    console.log(`🪙 Mint amount (smallest unit): ${mintAmount}`);

    if (mintAmount <= 0) {
      console.log('❌ Mint amount too small');
      process.exit(1);
    }

    // Create mint instruction
    console.log('📦 Creating token mint instruction...');
    const mintInstruction = createMintToInstruction(
      mintPublicKey, // mint
      recipientTokenAccount, // destination
      authorityPublicKey, // authority
      mintAmount, // amount
      [], // multiSigners
      TOKEN_PROGRAM_ID
    );

    transaction.add(mintInstruction);

    // Get transaction size
    const serialized = transaction.serialize({ requireAllSignatures: false });
    console.log('✅ Transaction size:', serialized.length, 'bytes\n');

    // Simulate transaction
    console.log('🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ SPL Token mint transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', Buffer.from(serialized).toString('base64').substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

// Initialize NestJS app for testing services
let app;
let transactionBuilderService;
let metaplexService;

async function initializeServices() {
  if (!app) {
    const { NestFactory } = require('@nestjs/core');
    const { AppModule } = require('./src/app.module');

    app = await NestFactory.createApplicationContext(AppModule);
    transactionBuilderService = app.get('TransactionBuilderService');
    metaplexService = app.get('MetaplexService');

    console.log('✅ Services initialized\n');
  }
}

async function testCreateToken() {
  console.log('🔍 Testing Token Creation with Metaplex...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Test token parameters
  const tokenParams = {
    name: 'Test Blink Token',
    symbol: 'BLINK',
    decimals: 9,
    uri: 'https://arweave.net/test-metadata.json',
    initialSupply: 1000000,
    recipientAddress: '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'
  };

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Token Name:', tokenParams.name);
  console.log('  Symbol:', tokenParams.symbol);
  console.log('  Decimals:', tokenParams.decimals);
  console.log('  Initial Supply:', tokenParams.initialSupply);
  console.log('  Recipient:', tokenParams.recipientAddress);
  console.log('  URI:', tokenParams.uri, '\n');

  try {
    // Initialize services
    await initializeServices();

    // Create token transaction
    console.log('🏭 Creating token with Metaplex...');
    const serializedTransaction = await metaplexService.createTokenWithMetadata(tokenParams);
    console.log('✅ Token creation transaction created\n');

    // Parse and validate transaction
    const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    console.log('📊 Transaction Details:');
    console.log('  Size:', transactionBuffer.length, 'bytes');
    console.log('  Version:', transaction.version);
    console.log('  Instructions:', transaction.message.compiledInstructions.length);

    // Simulate transaction
    console.log('\n🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ Token creation transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', serializedTransaction.substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testMintTokens() {
  console.log('🔍 Testing Token Minting from Existing Supply...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // For testing, we'll use a known devnet token mint
  // In production, this would be a mint controlled by the server
  const MINT_ADDRESS = 'So11111111111111111111111111111111111111112'; // Wrapped SOL for testing
  const RECIPIENT_WALLET = 'isSereA3nQ97DJXnjNFc1JAFWBF9cdH8W6tvDdogK9W';
  const AMOUNT = 0.01; // Small amount for testing
  const DECIMALS = 9;

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Mint:', MINT_ADDRESS);
  console.log('  Recipient:', RECIPIENT_WALLET);
  console.log('  Amount:', AMOUNT, 'tokens');
  console.log('  Decimals:', DECIMALS, '\n');

  console.log('⚠️  Note: This test uses Wrapped SOL mint for simulation.');
  console.log('   In production, you need to be the mint authority.\n');

  try {
    // Initialize services
    await initializeServices();

    // Create mint transaction using transaction builder
    console.log('🪙 Creating token mint transaction...');
    const serializedTransaction = await transactionBuilderService.createSplMintTransaction(
      '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka', // authority (your wallet)
      MINT_ADDRESS,
      RECIPIENT_WALLET,
      AMOUNT,
      DECIMALS
    );
    console.log('✅ Mint transaction created\n');

    // Parse and validate transaction
    const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
    const transaction = Transaction.from(transactionBuffer);

    console.log('📊 Transaction Details:');
    console.log('  Size:', transactionBuffer.length, 'bytes');
    console.log('  Instructions:', transaction.instructions.length);
    console.log('  Fee Payer:', transaction.feePayer?.toBase58());

    // Simulate transaction
    console.log('\n🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ Token mint transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', serializedTransaction.substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testCreateNftCollection() {
  console.log('🔍 Testing NFT Collection Creation...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // Test collection parameters
  const collectionParams = {
    name: 'Test Blink Collection',
    symbol: 'BLINKCOLL',
    uri: 'https://arweave.net/test-collection-metadata.json',
    sellerFeeBasisPoints: 500 // 5%
  };

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Collection Name:', collectionParams.name);
  console.log('  Symbol:', collectionParams.symbol);
  console.log('  URI:', collectionParams.uri);
  console.log('  Royalties:', (collectionParams.sellerFeeBasisPoints / 100) + '%', '\n');

  try {
    // Initialize services
    await initializeServices();

    // Create collection transaction
    console.log('🏗️ Creating NFT collection with Metaplex...');
    const serializedTransaction = await metaplexService.createNftCollection(collectionParams);
    console.log('✅ NFT collection creation transaction created\n');

    // Parse and validate transaction
    const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    console.log('📊 Transaction Details:');
    console.log('  Size:', transactionBuffer.length, 'bytes');
    console.log('  Version:', transaction.version);
    console.log('  Instructions:', transaction.message.compiledInstructions.length);

    // Simulate transaction
    console.log('\n🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ NFT collection creation transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', serializedTransaction.substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testMintNft() {
  console.log('🔍 Testing NFT Minting from Collection...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // For testing, we'll use a mock collection address
  // In production, this would be a real collection created by the server
  const COLLECTION_ADDRESS = '11111111111111111111111111111112'; // Mock collection for testing
  const RECIPIENT_WALLET = 'isSereA3nQ97DJXnjNFc1JAFWBF9cdH8W6tvDdogK9W';

  // Test NFT parameters
  const nftParams = {
    collectionAddress: COLLECTION_ADDRESS,
    name: 'Test Blink NFT #1',
    uri: 'https://arweave.net/test-nft-metadata.json',
    recipientAddress: RECIPIENT_WALLET
  };

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Collection:', nftParams.collectionAddress);
  console.log('  NFT Name:', nftParams.name);
  console.log('  URI:', nftParams.uri);
  console.log('  Recipient:', nftParams.recipientAddress, '\n');

  console.log('⚠️  Note: This test uses a mock collection address.');
  console.log('   In production, use a real collection created by the server.\n');

  try {
    // Initialize services
    await initializeServices();

    // Create NFT mint transaction
    console.log('🎨 Creating NFT mint transaction...');
    const serializedTransaction = await metaplexService.mintNftFromCollection(nftParams);
    console.log('✅ NFT mint transaction created\n');

    // Parse and validate transaction
    const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    console.log('📊 Transaction Details:');
    console.log('  Size:', transactionBuffer.length, 'bytes');
    console.log('  Version:', transaction.version);
    console.log('  Instructions:', transaction.message.compiledInstructions.length);

    // Simulate transaction
    console.log('\n🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ NFT mint transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', serializedTransaction.substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

async function testBatchAirdrop() {
  console.log('🔍 Testing Batch Token Airdrop...\n');

  // Configuration
  const RPC_URL = 'https://api.devnet.solana.com';
  const connection = new Connection(RPC_URL, 'confirmed');

  // For testing, we'll use Wrapped SOL
  const MINT_ADDRESS = 'So11111111111111111111111111111111111111112';

  // Test recipients
  const recipients = [
    { address: 'isSereA3nQ97DJXnjNFc1JAFWBF9cdH8W6tvDdogK9W', amount: 0.001 },
    { address: '11111111111111111111111111111112', amount: 0.002 },
    { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: 0.001 }
  ];

  const airdropParams = {
    mintAddress: MINT_ADDRESS,
    recipients: recipients,
    decimals: 9,
    authorityAddress: '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka', // Your wallet as authority
    payerAddress: '5nWF63PbuUwqzHBDWjuafCZpF7A7gJ7v5q3eLV96i3Ka'   // Your wallet as payer
  };

  console.log('📝 Configuration:');
  console.log('  RPC URL:', RPC_URL);
  console.log('  Mint:', airdropParams.mintAddress);
  console.log('  Recipients:', recipients.length);
  recipients.forEach((r, i) => {
    console.log(`    ${i + 1}. ${r.address}: ${r.amount} tokens`);
  });
  console.log('  Decimals:', airdropParams.decimals);
  console.log('  Authority:', airdropParams.authorityAddress, '\n');

  console.log('⚠️  Note: This test uses Wrapped SOL mint for simulation.');
  console.log('   In production, you need to be the mint authority.\n');

  try {
    // Initialize services
    await initializeServices();

    // Create batch airdrop transaction
    console.log('📦 Creating batch airdrop transaction...');
    const serializedTransaction = await transactionBuilderService.createBatchAirdropTransaction(airdropParams);
    console.log('✅ Batch airdrop transaction created\n');

    // Parse and validate transaction
    const transactionBuffer = Buffer.from(serializedTransaction, 'base64');
    const transaction = Transaction.from(transactionBuffer);

    console.log('📊 Transaction Details:');
    console.log('  Size:', transactionBuffer.length, 'bytes');
    console.log('  Instructions:', transaction.instructions.length);
    console.log('  Fee Payer:', transaction.feePayer?.toBase58());

    // Simulate transaction
    console.log('\n🔄 Simulating transaction...\n');
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      console.log('❌ SIMULATION FAILED!\n');
      console.log('Error:', JSON.stringify(simulation.value.err, null, 2));
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));
      process.exit(1);
    } else {
      console.log('✅ SIMULATION SUCCESS!\n');
      console.log('Compute units used:', simulation.value.unitsConsumed);
      console.log('\nLogs:');
      simulation.value.logs?.forEach(log => console.log('  ', log));

      console.log('\n✨ Batch airdrop transaction is valid and ready to sign!');
      console.log('📤 Base64 transaction:', serializedTransaction.substring(0, 50) + '...');
    }

  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    console.log('\nFull error:', error);
    process.exit(1);
  }
}

// Run test
// testMemoTransaction();
// testSolTransfer();
// testSplTransfer();
// testSplMint();

// New mint token tests
// testCreateToken();
// testMintTokens();
// testCreateNftCollection();
// testMintNft();
testBatchAirdrop();
